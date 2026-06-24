<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columnNames = config('permission.column_names');
        $tables = ['model_has_roles', 'model_has_permissions'];

        foreach ($tables as $table) {
            Schema::table($table, static function (Blueprint $table) use ($columnNames) {
                $column = $columnNames['model_morph_key'] ?? 'model_id';
                $table->string($column)->change();
            });
        }
    }

    public function down(): void
    {
        $columnNames = config('permission.column_names');
        $tables = ['model_has_roles', 'model_has_permissions'];

        foreach ($tables as $table) {
            Schema::table($table, static function (Blueprint $table) use ($columnNames) {
                $column = $columnNames['model_morph_key'] ?? 'model_id';
                $table->unsignedBigInteger($column)->change();
            });
        }
    }
};
