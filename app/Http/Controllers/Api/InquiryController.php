<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\InquiryMessage;
use App\Models\Property;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    // آیا این کاربر یکی از دو طرف گفتگو است؟
    private function isParticipant(Inquiry $inquiry, $user): bool
    {
        return (int) $inquiry->inquirer_id === (int) $user->id
            || (int) $inquiry->agent_id === (int) $user->id;
    }

    // فهرست درخواست‌های من (agent: درخواست‌های رسیده، خریدار/مستأجر: درخواست‌های فرستاده)
    public function index(Request $request)
    {
        $user  = $request->user();
        $query = Inquiry::with(['property:id,title', 'inquirer:id,name']);

        if ($user->role === 'agent') {
            $query->where('agent_id', $user->id);
        } else {
            $query->where('inquirer_id', $user->id);
        }

        return response()->json($query->latest()->paginate(10));
    }

    // فرستادن درخواست برای یک ملک (فقط خریدار و مستأجر)
    public function store(Request $request, $id)
    {
        $user = $request->user();

        if (! in_array($user->role, ['buyer', 'tenant'])) {
            return response()->json([
                'message' => 'Only buyers and tenants can send inquiries',
            ], 403);
        }

        $property = Property::findOrFail($id);

        $data = $request->validate([
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $inquiry = Inquiry::create([
            'property_id' => $property->id,
            'inquirer_id' => $user->id,
            'agent_id'    => $property->agent_id,
            'subject'     => $data['subject'] ?? null,
            'message'     => $data['message'],
        ]);

        return response()->json([
            'message' => 'Inquiry sent successfully',
            'inquiry' => $inquiry,
        ], 201);
    }

    // دیدن یک درخواست همراه با پیام‌ها (فقط دو طرف گفتگو)
    public function show(Request $request, $id)
    {
        $inquiry = Inquiry::with([
            'property:id,title',
            'inquirer:id,name',
            'messages' => function ($q) {
                $q->orderBy('id');
            },
            'messages.sender:id,name',
        ])->findOrFail($id);

        if (! $this->isParticipant($inquiry, $request->user())) {
            return response()->json([
                'message' => 'You cannot view this inquiry',
            ], 403);
        }

        return response()->json($inquiry);
    }

    // فرستادن پیام در یک درخواست (فقط دو طرف گفتگو)
    public function reply(Request $request, $id)
    {
        $user    = $request->user();
        $inquiry = Inquiry::findOrFail($id);

        if (! $this->isParticipant($inquiry, $user)) {
            return response()->json([
                'message' => 'You cannot reply to this inquiry',
            ], 403);
        }

        if ($inquiry->status === 'closed') {
            return response()->json([
                'message' => 'This inquiry is closed',
            ], 409);
        }

        $data = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $message = InquiryMessage::create([
            'inquiry_id' => $inquiry->id,
            'sender_id'  => $user->id,
            'message'    => $data['message'],
        ]);

        // وقتی agent برای اولین بار جواب می‌دهد، وضعیت responded می‌شود
        if ((int) $inquiry->agent_id === (int) $user->id && $inquiry->status === 'pending') {
            $inquiry->update(['status' => 'responded']);
        }

        return response()->json([
            'message'         => 'Message sent successfully',
            'inquiry_message' => $message,
        ], 201);
    }

    // بستن درخواست (فقط دو طرف گفتگو)
    public function close(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);

        if (! $this->isParticipant($inquiry, $request->user())) {
            return response()->json([
                'message' => 'You cannot close this inquiry',
            ], 403);
        }

        $inquiry->update(['status' => 'closed']);

        return response()->json([
            'message' => 'Inquiry closed',
        ]);
    }
}