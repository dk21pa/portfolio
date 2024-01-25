'use strict';
$(document).ready(function () {
    let startX;  //タップ時のx座標
    let endX;  //タップ終了時のx座標
    let left;  //タップ操作開始時のleftプロパティ
    let nowIndex = 0;  //選択している画像のインデックス番号
    let clickable = true;  //現在クリックできるかどうか
    const moveTime = 200;  //画像が移動し切るまでの時間
    const slider = $('#slider');  //画像を持つ親要素
    let images = slider.find('img').toArray();  //画像の要素（配列）
    const imageWidth = $(images[0]).width();  //画像の幅
    const offset = () => {  //一度に移動させる距離
        return imageWidth + parseInt(slider.css('gap'));
    }
    const buttons = $('#sliderIcons>div>div').toArray();  //黒丸の要素5個を配列で取得
    let isPC = 768 < $('body').width() ? true : false;  //今がpc表示かモバイル用か
    const displayWidth = () => {  //その時の表示幅を読み取る関数
        return isPC ? 1366 : $('body').width();
    }

    const moveRight = async () => {  //一つ右の画像に移動する
        if (!clickable) return
        clickable = false;
        //ボタンの色変化
        $(buttons[nowIndex]).css('background-color', '#8F8F8F');
        nowIndex = (nowIndex + 1) % 5;
        $(buttons[nowIndex]).css('background-color', 'black');
        //移動アニメーション
        const leftPosition = displayWidth() / 2 - 4 * offset() - imageWidth / 2;
        await Promise.all(
            $(images).map((_, element) => {
                return new Promise(resolve => {
                    $(element).animate({ left: `${leftPosition}px` }, moveTime, 'linear', resolve);
                });
            })
        );
        //アニメーション終了後に画像の追加と削除、位置の修正
        const path = `images/03gallery0${(nowIndex + 3) % 5 + 1}.png`
        const img = $('<img>').attr('src', path);
        slider.append(img);
        slider.children().first().remove();
        images = slider.find('img').toArray();
        const newLeftPosition = displayWidth() / 2 - 3 * offset() - imageWidth / 2;
        $(images).each((_, element) => {
            $(element).css('left', `${newLeftPosition}px`);
        });
        clickable = true;
    }

    const moveLeft = async () => {   //一つ左の画像に移動する
        if (!clickable) return;
        clickable = false;
        //ボタンの色変化
        $(buttons[nowIndex]).css('background-color', '#8F8F8F');
        nowIndex = (nowIndex + 4) % 5;
        $(buttons[nowIndex]).css('background-color', 'black');
        //移動アニメーション
        const leftPosition = displayWidth() / 2 - 2 * offset() - imageWidth / 2;
        await Promise.all(
            $(images).map((_, element) => {
                return new Promise(resolve => {
                    $(element).animate({ left: `${leftPosition}px` }, moveTime, 'linear', resolve);
                });
            })
        );
        //アニメーション終了後に画像の追加と削除、位置の修正
        const path = `images/03gallery0${(nowIndex + 2) % 5 + 1}.png`
        const img = $('<img>').attr('src', path);
        slider.prepend(img);
        slider.children().last().remove();
        images = slider.find('img').toArray();
        const newLeftPosition = displayWidth() / 2 - 3 * offset() - imageWidth / 2;
        $(images).each((_, element) => {
            $(element).css('left', `${newLeftPosition}px`);
        });
        clickable = true;
    }

    //右矢印をクリックしたとき
    $('#rightArrow').click(moveRight);

    //左矢印をクリックしたとき
    $('#leftArrow').click(moveLeft);

    //黒丸のボタンを押した時
    $(buttons).click(function () {
        if (!clickable) return;
        const index = $(this).index();  //クリックされたボタンのインデックス番号
        const dif = (index - nowIndex + 7) % 5 - 2;  //現在のインデックス番号とクリックされたインデックス番号の差 
        switch (dif) {
            case 0:
                return;
            case 1:
                moveRight();
                break;
            case 2:
                const doubleRight = async () => {
                    await moveRight();
                    moveRight();
                }
                doubleRight();
                break;
            case -1:
                moveLeft();
                break;
            case -2:
                const doubleLeft = async () => {
                    await moveLeft();
                    moveLeft();
                }
                doubleLeft();
                break;
        }
    });

    // モバイルでのスワイプ操作時の挙動
    $(slider).on('touchstart', (event) => {
        if (!clickable) return;
        left = parseInt($(images[0]).css('left'));
        startX = event.originalEvent.touches[0].clientX;
        endX = startX;
    });

    $(slider).on('touchmove', (event) => {
        if (!clickable) return;
        endX = event.originalEvent.touches[0].clientX;
        $(images).each((_, element) => {
            $(element).css('left', `${left + endX - startX}px`);
        });
    });

    $(slider).on('touchend', async () => {
        if (!clickable) return
        const dif = endX - startX;
        if (dif < -offset() / 2) {
            moveRight();
        } else if (dif > offset() / 2) {
            moveLeft();
        } else {
            clickable = false;
            const newMoveTime = moveTime * Math.abs(dif) / offset() * 2;
            await Promise.all(
                $(images).map((_, element) => {
                    return new Promise(resolve => {
                        $(element).animate({ left: `${left}px` }, newMoveTime, 'linear', resolve);
                    });
                })
            );
            clickable = true;
        }
    });

    //画面幅が変わったとき
    $(window).resize(() => {
        const isNewPC = 768 < $('body').width() ? true : false;
        if (isPC && isNewPC) {  //pc表示 ⇒ pc表示でのサイズ変更では何もしない
            return;
        } else {  //pc⇒sp, sp⇒pc, sp⇒spでの幅変化時、画像の位置を修正する
            isPC = isNewPC;  //現在モバイル用かPC用か更新する
            $(images).each((_, element) => {
                $(element).css('left', `${displayWidth() / 2 - 3 * offset() - imageWidth / 2}px`);
            });
        }
    });
});