<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('md_districts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('provience_id')->constrained('md_proviences')->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('code', 10)->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('md_districts');
    }
};
