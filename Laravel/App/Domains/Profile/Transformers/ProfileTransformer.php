<?php

namespace App\Domains\Profile\Transformers;

use App\Models\Profile;

class ProfileTransformer
{
    public function transform(Profile $profile): array
    {
        return [
            'id'              => $profile->id,
            'user_id'         => $profile->user_id,
            'name'            => $profile->name,
            'gender'          => $profile->gender,
            'date_of_birth'   => $profile->date_of_birth?->format('Y-m-d'),
            'occupation_type' => $profile->occupation_type,
            'image'           => $profile->image,
            'mobile'          => $profile->mobile,
            'mobile_verified' => !is_null($profile->mobile_verified_at),
        ];
    }
}
