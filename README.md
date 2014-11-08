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


### Public Metodlar
------------------------------ | -------------------------------------------------------
$(selector).textlimit(options) | Bu method plugini manuel olarak bir elemana bağlamanızı sağlar.
$.uxtextlimit                  | Bu method pluginin detayını görmenizi sağlar.
$.uxtextlimit.version          | Sayfaya eklenmiş pluginin versiyon numarasını gösterir.
