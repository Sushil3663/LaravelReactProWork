<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lookups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type', 50);              // 'relationship', 'country', etc.
            $table->string('code', 50)->nullable();   // Optional code like 'NP' for Nepal
            $table->string('title', 100);             // Display name like 'AUNT', 'Nepal'
            $table->uuid('parent_id')->nullable();    // For hierarchy
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('lookups')->onDelete('cascade');
            $table->index('type');
            $table->unique(['type', 'code', 'title']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lookups');
    }
};