window.onload = function() {

    // 반응형 최대 상품 갯수 변경 설정
    var work_list = document.querySelectorAll('.comm_prod_data');
    Array.prototype.forEach.call(work_list, function(value) {
        var max = parseInt(value.getAttribute('data-prod-max'));
        var inner_w = window.innerWidth;

        switch( max ) {
            case 5 :
                value.classList.add('comm_prod_x');
                break;
            case 10 : 
                value.classList.add('comm_prod_2x');
                break;
        }
        if( inner_w < 1280 ) {
            switch(max) {
                case 5 : 
                    value.setAttribute('data-prod-max', 4);
                    break;
                case 10 :
                    value.setAttribute('data-prod-max', 8);
                    break;
            }
        }
        if( inner_w < 1024 ) {
            switch(max) {
                case 5 : 
                    value.setAttribute('data-prod-max', 3);
                    break;
                case 10 :
                    value.setAttribute('data-prod-max', 6);
                    break;
            }
        }
        if( inner_w < 768 ) {
            value.setAttribute('data-prod-max', 15);
        }
    });

    // comm_prod_data >> product json 넣을 공통 클래스 
   var prod_xhr = new this.XMLHttpRequest();
   prod_xhr.open('GET', 'js/product.json', true);
   prod_xhr.send();

   prod_xhr.onreadystatechange = function() {
      if( prod_xhr.readyState === XMLHttpRequest.DONE ) {

         if( prod_xhr.status == 200 ) {
            var prod_data = JSON.parse(prod_xhr.responseText);
            var prod_list = document.querySelectorAll('.comm_prod_data');

            if( prod_list.length !== 0 ) {
            
                Array.prototype.forEach.call(prod_list, function(value_parent) {
                var max_prod = value_parent.getAttribute('data-prod-max');
                
                prod_data.forEach(function(value, index) {
                    var inner = '';
                    var prod_i = document.createElement('div');
                    
                    if( index < parseInt(max_prod) && value.display !== 'none' ) {
                        // prod_i.classList.add('prod__i', 'comm_prods');
                        prod_i.classList.add('prod__i');
                        inner += '<div class="prod__img">';
                        inner += '<div class="img_wrap">';
                        inner += '<a href="#">';
                        inner += '<img src="' + value.image + '" alt="' + value.name + ' 실개체 사진' + '" class="img">';
                        inner += '</a>';
                        inner += '</div>';
                        inner += '<div class="prod__quick_menu">';
                        inner += '<div class="menu_wrap">';
                        inner += '<div class="menu__i prod__like_wrap">';
                        inner += '<input type="button" class="prod__like" value="좋아요">';
                        inner += '<p class="prod__text prod__like_text">관심상품</p>';
                        inner += '</div>';
                        inner += '<div class="menu__i prod__cart_wrap">';
                        inner += '<input type="button" class="prod__cart" value="장바구니 담기">';
                        inner += '<p class="prod__text prod__cart_text">장바구니 담기</p>';
                        inner += '</div>';
                        inner += '<div class="menu__i prod__direct_purchase_wrap">';
                        inner += '<input type="button" class="prod__direct_purchase" value="바로구매">';
                        inner += '<p class="prod__text prod__direct_purchase_text">바로구매</p>';
                        inner += '</div>';
                        inner += '</div>';
                        inner += '</div>';
                        inner += '</div>';
                        inner += '<div class="prod__info">';
                        inner += '<p class="prod_name">' + value.name + '</p>';
                        inner += '<p class="prod_price">' + value.price + '</p>';
                        inner += '</div>';
                        inner += '</div>';
        
                        prod_i.innerHTML = inner;
                        value_parent.appendChild(prod_i);
                    }
                });
                })
            }
         } else {
            console.log('fail to load');
         }
      }
   };

    // scroll event
    window.addEventListener('scroll', function() {
        var st = window.scrollY || window.pageYOffset;
        var header = document.querySelector('.header__top');

        if( st >= 100 && window.innerWidth > 768 ) {
            header.classList.add('header__top-active');
        } else {
            header.classList.remove('header__top-active');
        }
    });

    // 공통 taggle funciton
    function comm_toggle_fn(class_name) {
        this.classList.contains(class_name) ? this.classList.remove(class_name) : this.classList.add(class_name);
    };

    // 북마크
    var header_bookmark = document.querySelector('.header__bookmark');
    if( header_bookmark != null) {
        header_bookmark.addEventListener('click', function(event) {
            comm_toggle_fn.call(this, 'header__bookmark-active');
        });
    }
    
    // comm prod 관심상품 장바구니 넣기 바로구매 등등
    var comm_prods = document.querySelectorAll('.comm_prod_data');
    if( comm_prods.length !== 0 ) {
        Array.prototype.forEach.call(comm_prods, function(value) {
            value.addEventListener('click', function(event) {
                
                // 관심상품
                if( event.target.classList.contains('prod__like') ) {
                    comm_toggle_fn.call(event.target, 'prod__like-active');
                }
            });
        });
    }

    // 실시간 검색어
    {
        var REALTIME_COUNT = 0;
        var realtime_childs = document.querySelectorAll('.realtime__child');
        function realtime_itv_fn() {
            var rt_header = document.getElementById('realtime_header');
            var target = realtime_childs[REALTIME_COUNT];
            var keyword = target.querySelector('.keyword > a').innerHTML;
            var adv = target.querySelector('.realtime__adv > a').innerHTML;
    
            rt_header.querySelector('.grade').innerHTML = (REALTIME_COUNT+1);
            rt_header.querySelector('.keyword > a').innerHTML = keyword;
            rt_header.querySelector('.realtime__adv > a').innerHTML = adv;
            REALTIME_COUNT == 9 ? REALTIME_COUNT = 0 : REALTIME_COUNT++;    
        }
        realtime_itv_fn();
        var realtime_itv = setInterval(realtime_itv_fn, 5000);
    }

    // 메인 비쥬얼, 배너
    var main_visuals = document.querySelectorAll('.main_visual');
    Array.prototype.forEach.call(main_visuals, function(value) {
        value.addEventListener('click', function(event) {
            var inner = value.querySelector('.visuals_inner');
            var vis = value.querySelectorAll('.visuals');
            var leng = vis.length - 1;
            
            // 다음 배너 보기 
            if( event.target.classList.contains('next') ) {
                inner.classList.add('visual_inner-active');

                function nextInnerMove() {
                    inner.appendChild(vis[0]);
                    inner.classList.remove('visual_inner-active');
                    this.removeEventListener('animationend', nextInnerMove);
                }
                inner.addEventListener('animationend', nextInnerMove);
            }
            // 이전 배너 보기
            if( event.target.classList.contains('prev') ) {
                inner.style.transform = 'translateX(-100%)';
                inner.classList.add('preset_next');
                inner.insertBefore(vis[leng], vis[0]);
                inner.classList.add('visual_inner-active-next');

                function prevInnerMove() {
                    inner.style.transform = 'unset';
                    inner.classList.remove('visual_inner-active-next');
                    inner.removeEventListener('animationend', prevInnerMove);
                }
                inner.addEventListener('animationend', prevInnerMove);
            }
        });
    });

    var auto_rolling_banner = document.querySelectorAll('.main_visual .next');
    var res1024 = window.matchMedia('screen and (max-width: 1024px)');
    var stv_rolling_banner = setInterval(function() {
        if( auto_rolling_banner.length !== 0 && !res1024.matches ) {
            auto_rolling_banner[0].click();
        } else {
            auto_rolling_banner[1].click();
        }
    }, 8000);
    // stv_rolling_banner();
}