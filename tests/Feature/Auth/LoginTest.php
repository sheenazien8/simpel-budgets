<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson(route("login"), [
            "username" => $user->email,
            "password" => "password",
        ]);

        $response->assertOk();
        $response->assertJsonStructure(["data" => ["access_token", "token_type", "expires_in"]]);
    }

    public function test_user_cannot_login_with_wrong_password(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson(route("login"), [
            "username" => $user->email,
            "password" => "wrong-password",
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(["username"]);
    }
}
