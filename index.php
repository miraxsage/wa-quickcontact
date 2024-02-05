<?php
/*
Plugin Name: WebArch QuickContact
Description: Плагин для добавления кнопки быстрых контактов для связи
Author: WebArchitect
Version: 1.0.0
Author URI: https://webarchitect.ru/
*/

$dir_sep = DIRECTORY_SEPARATOR;
define("WAQCT_PLUGIN_DIR", preg_replace("|[\\/]$|", "", plugin_dir_path(__FILE__)).$dir_sep);
define("WAQCT_PLUGIN_URI", plugin_dir_url(__FILE__));
define("WAQCT_BUILD_DIR", WAQCT_PLUGIN_DIR."assets{$dir_sep}js{$dir_sep}admin-panel{$dir_sep}build{$dir_sep}");
define("WAQCT_BUILD_URI", WAQCT_PLUGIN_URI."assets/js/admin-panel/build/");

require_once WAQCT_PLUGIN_DIR . 'functions.php';
