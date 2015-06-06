UX Rocket Text Limit
==================

```HTML
<input type="text" class="textlimit" maxlength="50" />
<input type="text" class="textlimit" maxlength="15" data-visible="false" placeholder="Kalan karakter sayısı dilenirse gizlenebilir" />
<textarea class="textlimit" rows="5" maxlength="250"></textarea>
```

### Notlar
Karakter sayısı kolay bir şekilde `maxlength` attribute değeri ile tanımlanmaktadır.

Kalan karakter sayısı görünür durumdayken, içerik alanlarının genişliği, kalan sayının gösterilmesi için normal
tanımlandıkları genişlikten __10%__ daha kısadırlar. Kalan sayısı gizlendiği durumlarda ise normal
genişliktedirler.

### Önemli (textlimit tanımlarını güncelleme işlemleri)

Textlimit plugininin çalışma şeklinin tanımları `data` attributeleri ile yapıldığı durumlarda, güncelleme sırasında `$(".textlimit").attr('data-visible', false)` şeklinde yapılacak tanımlama işlemleri textlimiti güncellemeyecektir. `data` attribute güncellemelerinin `data()` fonksiyonu ile yapılması gerekmektedir.

```JAVASCRIPT
var $textlimit = $(".textlimit");
// Yanlış güncelleme 
$textlimit.attr('data-visible', false);
$.uxtextlimit.update($textlimit); // kalan sayısı görüntülenmeye devam edecektir

// Doğru güncelleme
$textlimit.data('visible', false);
$.uxtextlimit.update($textlimit); // kalan sayısı gizlenmeye başlayacaktır
```
Yukarıda belirtilen örnek ve güncelleme kullanımları data attribute ile belirlenen bütün textlimit özellikleri için geçerlidir.


### Tanımlar
Property             | Default          | Açıklama
-------------------- | ---------------- | --------
maxLength            | 0                | Karakter sayı limiti. __0__ iken, limit yoktur.
remaining            | .remaining       | Kalan karakter sayısının gösterildiği alan için css classı.
visible              | true             | Kalan alanının görünür olup olmayacağını belirler

Data Attribute             | &nbsp;
-------------------------- | -----
maxlength                  | __data-__ ön eki olmadan maxlength="123" şeklinde alan için olan karakter sayı limitini belirler.
remaining                  | Kalan karakter sayısının gösterildiği alan için css classı.
visible                    | Kalan alanının görünür olup olmayacağını belirler

Callback             | &nbsp;
-------------------- | -----
onReady              | TextLimit, form elemanına bağlandığında çalışacak fonksiyonu çağırır.
onLimit              | Alana girilebilecek maksimum karakter sayısına ulaştığında çalışacak fonksiyonu çağırır.
onUpdate             | Textlimite ait instance güncellendikten sonra çalışacak fonksiyonu çağırır.
onRemove             | Textlimite ait instance sayfadan kaldırıldıktan sonra çalışacak fonksiyonu çağırır.


### Public Metodlar
Method						             | Açıklama
------------------------------ | -------------------------------------------------------
$(selector).textlimit(options) | Bu method plugini manuel olarak bir elemana bağlamanızı sağlar.
$.uxtextlimit                  | Bu method pluginin detayını görmenizi sağlar.
$.uxtextlimit.update(el)       | Textlimit’i yeni ayarlarla günceller. `el` parametresi verilmemişse textlimit’i kullanan tüm elementleri günceller.
$.uxtextlimit.remove(el)       | Seçilen elemanda textlimit instance bilgisini ve textlimit aksiyonlarını kaldırır. `el` gönderilmezse sayfadaki bütün textlimitleri kaldırır.
$.uxtextlimit.version          | Sayfaya eklenmiş pluginin versiyon numarasını gösterir.
