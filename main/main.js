module.exports = function main() {
  
  };
  printInventory = function printInventory(inputs) {
      var goods = [];
      //统计购买的相同物品,返回对象数组【商品编号+数量】
      goods = countSameGoods(inputs,goods);
      //goods数组和AllItems对比得出【商品单价】
      goods = getGoodsPreMoney(goods);
      //goods数组和Promotions比对是否是属于优惠商品，对goods数组中的对象增加节约的数量,和花费的钱。
      goods = countPromotion(goods);
  
      //包装打印这个goods数组
      printGoods(goods);
  };
  function countSameGoods(inputs,goods) {
  
      var len = inputs.length;
  
      for(var i =0;i<len;i++) {
          var str = inputs[i].split('-');
          if(str.length == 1) {
              var obj = {code:str[0],num:1,premoney:0,costmoney:0,name:'name',unit:'unit',savemoney:0};
              for(var j =i+1;j<len;j++) {
                  if(inputs[j] == obj.code){
                      obj.num++;
                  }else break;
                  i++;
              }
              goods.push(obj);
          }else {
              var obj = {code:str[0],num:str[1],premoney:0,costmoney:0,name:'name',unit:'unit',savemoney:0};
              goods.push(obj);
          }
  
      }
      return goods;
  }
  function getGoodsPreMoney(goods) {
      var all = [];
      all = loadAllItems();
      for(var i =0;i<goods.length;i++) {
          for(var j =0;j<all.length;j++) {
              if(goods[i].code == all[j].barcode) {
                  goods[i].premoney = all[j].price;
                  goods[i].name = all[j].name;
                  goods[i].unit = all[j].unit;
              }
          }
      }
      return goods;
  }
  function countPromotion(goods) {
      var promotions = loadPromotions();
      var barcodes = [];
      for(var i =0;i<promotions.length;i++) {
          if (promotions[i].type == 'BUY_TWO_GET_ONE_FREE'){
              barcodes = promotions[i].barcodes;
              break;
          }
      }
      for(var i = 0;i<goods.length;i++) {
          goods[i].costmoney = (goods[i].num) * goods[i].premoney;
          for(var j =0;j<barcodes.length;j++) {
              //判断买二送一
              if(goods[i].code == barcodes[j]){
                  if (goods[i].num>2){
                      var number = goods[i].num/3;
                      number = parseInt(number);
                      goods[i].costmoney = (goods[i].num - number) * goods[i].premoney;
                      goods[i].savemoney = number * goods[i].premoney;
                  }
              }
          }
      }
      return goods;
  }
  function printGoods(goods) {
  
      var goodstr = [];
      var givestr = [];
      var totlemoney = 0;
      var savemoney = 0;
      var printtext = '';
      goods.forEach((obj)=>{
          var goodsitem = '名称：'+obj.name+'，数量：'+obj.num+obj.unit+'，单价：'+obj.premoney.toFixed(2)+'(元)，小计：'+obj.costmoney.toFixed(2)+'(元)\n';
          goodstr.push(goodsitem);
          if (obj.savemoney !=0)
              var giveitme = '名称：'+obj.name+'，数量：'+(obj.savemoney/obj.premoney)+obj.unit+'\n';
          givestr.push(giveitme);
          totlemoney += obj.costmoney;
          savemoney += obj.savemoney;
      });
      printtext = '***<没钱赚商店>购物清单***\n';
      goodstr.forEach((val)=>{
         printtext = printtext + val;
          //console.log(val)
      });
      printtext = printtext+'----------------------\n';
      printtext = printtext+'挥泪赠送商品：\n';
  //
      givestr.forEach((val)=>{
          if(val != null)
          printtext = printtext + val;
      });
      printtext = printtext+'----------------------\n';
      printtext = printtext+'总计：'+totlemoney.toFixed(2)+'(元)\n' +
           '节省：'+savemoney.toFixed(2)+'(元)\n' +
           '**********************';
  
      console.log(printtext);
  }
  
  
  
  
  
  
  loadAllItems = function loadAllItems() {
      return [
          {
              barcode: 'ITEM000000',
              name: '可口可乐',
              unit: '瓶',
              price: 3.00
          },
          {
              barcode: 'ITEM000001',
              name: '雪碧',
              unit: '瓶',
              price: 3.00
          },
          {
              barcode: 'ITEM000002',
              name: '苹果',
              unit: '斤',
              price: 5.50
          },
          {
              barcode: 'ITEM000003',
              name: '荔枝',
              unit: '斤',
              price: 15.00
          },
          {
              barcode: 'ITEM000004',
              name: '电池',
              unit: '个',
              price: 2.00
          },
          {
              barcode: 'ITEM000005',
              name: '方便面',
              unit: '袋',
              price: 4.50
          }
      ];
  }
  
  function loadPromotions() {
      return [
          {
              type: 'BUY_TWO_GET_ONE_FREE',
              barcodes: [
                  'ITEM000000',
                  'ITEM000001',
                  'ITEM000005'
              ]
          }
      ];
  }