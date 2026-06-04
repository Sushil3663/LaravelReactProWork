<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('md_proviences', function (Blueprint $table) {
            $table->foreignUuid('country_id')->nullable()->constrained('md_countrys')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('md_proviences', function (Blueprint $table) {
            $table->dropForeign(['country_id']);
            $table->dropColumn('country_id');
        });
    }
};
