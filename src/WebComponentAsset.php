<?php
namespace paw\webcomponent;

use yii\helpers\FileHelper;
use yii\web\AssetBundle;

class WebComponentAsset extends AssetBundle
{
    public $minify = null;

    public $css = [
        'paw-web-component.css',
    ];

    public $depends = [
        \paw\assets\ckeditor5\CKEditorAsset::class,
    ];

    public function init()
    {
        parent::init();
        $this->sourcePath = dirname(__DIR__) . '/dist';

        if ($this->minify === null) {
            $this->minify = (bool) !YII_DEBUG;
        }

        $this->js = [
            $this->minify ? 'paw-web-component.min.js' : 'paw-web-component.js',
        ];

        $cssFiles = FileHelper::findFiles($this->sourcePath, ['only' => [
            'paw-web-component*.css', 'paw-web-component.css',
        ]]);
        array_walk($cssFiles, function (&$item, $key) {
            $item = str_replace($this->sourcePath . '/', '', $item);
        });
        $this->css = $cssFiles;
    }
}
