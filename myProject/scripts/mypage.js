'use strict';
// PHPの関数を使うための非同期通信リクエスト
async function ajaxToPHP(functionName, options = {}) {
    try {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'common/function.php',
                method: 'POST',
                dataType: 'json',
                data: {
                    function: functionName,
                    ...options,
                },
                success: resolve,
                error: reject,
            });
        });
    } catch (error) {
        console.error('Ajax request failed:', error);
        return null;
    }
}

$(document).ready(async () => {
    const iconElement = $('#profile .icon img');
    const modalIconElement = $('.modal .icon img');
    let newIconFile;
    const overLayElement = $('#overLay');
    const messageElement = $('#message textarea');

    //DBのProfileテーブル更新
    async function updateProfileTable() {
        return await ajaxToPHP('updateProfileTable', {
            radius: iconRadius,
            color: iconBgColor,
            message, iconX, iconY, scale,
        });
    }

    //アイコンのDOM更新
    async function updateIconDOM() {
        const containerStyles = {
            'background-color': iconBgColor,
            'border-radius': iconRadius + "%",
        };
        const imageStyles = {
            'transform': `scale(${scale})`,
            'top': iconY + '%',
            'left': iconX + '%',
        }

        $("#profileImage, #imageContainer").css(containerStyles);
        iconElement.add(modalIconElement).css(imageStyles);

        if (!newIconFile) return;

        newIconFile = await uploadIconImage();
        //ファイル名が同じなので、適当な一意のパラメータを指定してキャッシュを参照しないようにする
        const timestamp = new Date().getTime();
        iconElement.attr('src', `${newIconFile}?t=${timestamp}`);
        newIconFile = null;
    }

    async function uploadIconImage() {
        const formData = new FormData();
        formData.append('function', 'uploadIconImage');
        formData.append('image', newIconFile);

        const data = await $.ajax({
            url: 'common/function.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: res => res,
            error: (xhr, status, error) => {
                console.error('There was an error!', error);
            }
        });
        return JSON.parse(data);
    }

    //プロフィールを保存状態の前に戻す(DOM)
    async function undoIconDOM() {
        ({ message, iconRadius, iconBgColor, iconX, iconY, scale } = profile);
        $('#colorPicker').val(iconBgColor);
        $('#radiusSlider input').val(iconRadius);

        $("#imageContainer").css({
            'background-color': iconBgColor,
            'border-radius': iconRadius + '%',
        });
        modalIconElement.css({
            top: iconY + '%',
            left: iconX + '%',
            transform: `scale(${scale})`,
        });

        newIconFile = null;
        messageElement.val(message);
        $('#imageFile').val('');

        const filePath = await ajaxToPHP('getIconPath');
        modalIconElement.attr('src', filePath);
    }

    //DBからプロフィール情報を取得して変数に格納・DOMに反映
    let profile = await ajaxToPHP('readProfile');
    const userID = profile.profile_id;
    let { iconBgColor, message, iconRadius, iconX, iconY, scale } = profile;
    updateIconDOM();

    if (userID === 1) {
        $('.hoverable').removeClass('hoverable');
    } else {
        messageElement.prop('disabled', false);
        $('#messageBtn').css('display', 'block');
    }
    //メッセージ入力ごとに幅を変える
    messageElement.on('input', function (event) {
        if (userID === 1) {
            event.preventDefault();
            return;
        }
        message = $(this).val();
    });

    async function modalFadeout() {
        await new Promise(resolve => $('.modal').add(overLayElement).fadeOut(resolve))
        $("body").css("overflow", "auto");
    }
    //プロフィールモーダルの表示・非表示
    $("#profileImage").on('click touchstart', () => {
        if (userID === 1) return;
        $("body").css("overflow", "hidden");
        $('.modal').add(overLayElement).fadeIn().css("display", "flex");
    });
    $(overLayElement).add($('.undoProfile')).on('click touchstart', async () => {
        await modalFadeout();
        undoIconDOM();
    });

    //プロフィール更新ボタン
    $('.updateProfile').on('click touchstart', async () => {
        const confirm = window.confirm('プロフィールを変更しますか？\n変更は元に戻せません。');
        if (!confirm) return;
        modalFadeout();
        await updateProfileTable();
        profile = await ajaxToPHP('readProfile');
        updateIconDOM();
    });

    //一日一回の豆知識表示
    $("#trivia").on('click', async () => {
        const span = $("#trivia span");

        //一日一回まで
        $("#trivia").prop('disabled', true);

        //ローディング開始
        span.text('');
        span.addClass("loading");

        //新しい豆知識取得
        const fact = await ajaxToPHP('insertTrivia');

        //ローディングやめて豆知識表示
        span.removeClass("loading");
        span.text(`: ${fact}`);

    });
    //アイコン画像のアップロード
    $('#imageFile').on('change', function () {
        const file = this.files[0];
        newIconFile = file;
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                modalIconElement.attr('src', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    let isDragging = false;
    let lastX, lastY;
    let initialDistance = 0;

    function handlePinch(event) {
        const touches = event.touches;
        if (!touches) return;
        if (touches.length >= 2) {
            const x1 = touches[0].clientX;
            const y1 = touches[0].clientY;
            const x2 = touches[1].clientX;
            const y2 = touches[1].clientY;
            const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

            if (initialDistance == 0) {
                initialDistance = distance;
            } else {
                const delta = distance - initialDistance;
                initialDistance = distance;
                updateScale(delta)
            }
        }
    }

    //アイコンの位置変更
    modalIconElement.on('mousedown touchstart', function (event) {
        event.preventDefault();
        initialDistance = 0;
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    });

    $(document).on('mouseup touchend', () => {
        isDragging = false;
        initialDistance = 0;
    });

    $(document).on('mousemove touchmove', function (event) {
        if (!isDragging) return;
        const containerSize = $('#imageContainer').width();
        const iconSize = modalIconElement.width();

        let deltaX, deltaY;
        if (event.touches) {
            deltaX = event.touches[0].clientX - lastX;
            deltaY = event.touches[0].clientY - lastY;
        } else {
            deltaX = event.clientX - lastX;
            deltaY = event.clientY - lastY;
        }

        //position:absolute における top とleft(px)
        let newLeft_px = parseFloat(modalIconElement.css('left')) + deltaX;
        let newTop_px = parseFloat(modalIconElement.css('top')) + deltaY;

        //アイコン領域のうち上下左右にmaxOverflowまで見切れて良い
        const maxOverflow = 0.5;
        newLeft_px = Math.max(-iconSize * maxOverflow, Math.min(newLeft_px, containerSize - iconSize * (1 - maxOverflow)));
        newTop_px = Math.max(-iconSize * maxOverflow, Math.min(newTop_px, containerSize - iconSize * (1 - maxOverflow)));

        //最後に親要素に対するtopとleftの値をパーセンテージに変換して更新する
        //ここでは%で指定できるが、CSSで自動的にpxに変換されているようだ
        const newLeft_percent = newLeft_px * 100 / containerSize;
        const newTop_percent = newTop_px * 100 / containerSize;
        modalIconElement.css({ left: newLeft_percent + '%', top: newTop_percent + '%' });

        iconX = newLeft_percent;
        iconY = newTop_percent;

        if (event.touches) {
            lastX = event.touches[0].clientX;
            lastY = event.touches[0].clientY;
        } else {
            lastX = event.clientX;
            lastY = event.clientY;
        }
        handlePinch(event);
    });

    function updateScale(delta) {
        if (delta < 0) {
            scale = Math.max(0.2, scale * 0.98);
        } else {
            scale = Math.min(5, scale * 1.02);
        }
        modalIconElement.css('transform', `scale(${scale})`);
    }

    //アイコンの拡大/縮小
    $('#imageContainer').on('wheel', function (event) {
        event.preventDefault();
        const delta = -event.originalEvent.deltaY;
        updateScale(delta);
    });


    //アイコン背景色の変更
    $('#colorPicker').on('input', function () {
        iconBgColor = $(this).val();
        $("#imageContainer").css('background-color', iconBgColor);
    });
    //アイコン半径の変更
    $('#radiusSlider input').on('input', function () {
        iconRadius = $(this).val();
        $("#imageContainer").css('border-radius', iconRadius + '%');
    });
});
export default ajaxToPHP;