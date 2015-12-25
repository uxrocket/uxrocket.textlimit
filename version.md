## Version 1.1.1
    - FIX: Html içerisine eklenen remaining elementinin destroy problemi giderildi.
    - FIX: Default max length değeri düzeltildi.
## Version 1.1.0
- DEĞİŞİKLİK: Plugin mimarisi değiştirildi

## Versiyon 0.9.0
- YENİ: `$.uxtextlimit.remove(el)` metodu eklendi.
- YENİ: `$.uxtextlimit.remove(el)` metodu eklendi.
- DEĞİŞİKLİK: Kontrol eventlerine `focus` ve `input` kontrolü eklendi.
- FIX: maxlength `0` olduğu durumda, limit kontrolünün iptal olmaması sorunu giderildi.


## Versiyon 0.8.0
- YENİ: Karakter sayısı metni option olarak eklendi.
- YENİ: `.remaining` elemanı için parent'a sahip olma durumu eklendi.
- DEĞİŞİKLİK: Limitlenen elemanın wrap edilme metodu değiştirildi.

## Versiyon 0.7.1
- FIX: uxRocket registrysi içine hasWrapper tanımı eklendi.

## Versiyon 0.7.0
- YENİ: Yeni tanımlanmaya başlayan, elemana bağlanmış uxRocket plugin listesi kontrolleri eklendi.
- YENİ: Plugin eventleri "uxTextLimit" namespace adı altında tanımlanmaya başlandı.
- DEĞİŞİKLİK: Fonksiyon parametresi olarak taşınan _karakter sayısı_ data içerisinden alınmaya başlandı.
- FIX: `opt` içine eklenmeyen `selector` düzeltildi.

## Versiyon 0.6.0
- DEĞİŞİKLİK: Input elemanından wrapper üzerine class isimleri aktarılırken, "uxitd-textlimit-ready" ve selector classı kaldırılmaya başlandı. 
- FIX: Diğer pluginlerden gelen data ile karıştığı için data('opt') tanımları data('uxTextLimit') olarak değiştirildi.

## Versiyon 0.5.1
- FIX: Class kontrolleri yüzünden, eklenecek eleman inputun kendisi mi yoksa değil mi kontrolü eklendi.