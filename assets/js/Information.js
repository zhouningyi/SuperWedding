



    var mapText = '上海交大闵行校区（东川路）'
    var panoText = '留园餐厅2楼'


    var Information = function(){
      this.mapType = true;
      this.panoTpye = true;
      this.mapBol = false;
      // this.map();
      // this.pano();
      // this.wraper();
      this.click();
    };

    Information.prototype.maps = function(){
      this.map = new Map($('#map'));
    // $('#mapDiv').find('.amap-logo').remove();
    // $('#mapDiv').find('.amap-copyright').remove();
    };

    Information.prototype.clearMap = function(){
      $('#map').find('.div').remove();
      $('#pano').find('.div').remove();
    }

    Information.prototype.pano = function(){
      var pano = new qq.maps.Panorama($('#pano')[0], {
        pano: '10021016120726133355000',
        disableMove: false,
        disableFullScreen: false,
        zoom:1,
        pov:{
            heading:355,
            pitch:-2
        }
    });
    };

    Information.prototype.shrink = function(){
      this.clearMap();
      this.mapType = true;
      this.panoTpye = true;
      this.mapBol = false;
      $('#map').removeClass('big').removeClass('fullScreen').css('zIndex',1).addClass('mapSmall').text(mapText);
      $('#pano').removeClass('big').removeClass('fullScreen').css('zIndex',1).addClass('panoSmall').text(panoText).css('background','rgba(0,150,180,0.7)');
    }

    Information.prototype.click = function(){
      var self = this;

      $('#map').click(function(){
        if(self.mapType){
          $('#pano').text('收起 ↑');
          self.panoTpye = false;
          if(!self.mapBol){
            $('#map').removeClass('mapSmall').addClass('big').css('zIndex',100000).text('');
            self.maps();
          }
          self.mapBol = true;
        }else{
           self.shrink();
        }
      });

      $('#pano').click(function(){
        if(self.panoTpye){
          self.mapType = false;
          $('#pano').removeClass('panoSmall').addClass('big').css('zIndex',100000).text('');
          $('#map').text('收起 ↑');
          self.pano();
        }else{
          self.shrink();
        }
        });
    }