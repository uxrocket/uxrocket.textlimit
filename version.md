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