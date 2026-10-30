# TV Kumanda

LG webOS televizyonları telefondan yönetmek için ücretsiz web uygulaması: kumanda, dokunmatik fare, klavye, rakam tuşları ve uygulama/kaynak listesi. Kurulum gerektirmez; telefonda Safari ile açıp ana ekrana eklenir.

**Adres:** https://byardimoglu.github.io/tv-kumanda/

## İlk kullanım

1. Telefon ve TV aynı ev ağında olmalı. TV'de **Ayarlar → Ağ → LG Connect Apps** açık olmalı.
2. Sayfayı aç, sağ üstteki ayarlardan TV'nin IP adresini gir (TV'de Ayarlar → Ağ bölümünde yazar).
3. TV'nin kendi imzaladığı güvenlik sertifikasını bir kez onayla: sayfadaki **Sertifikayı onayla** bağlantısı `https://TV-IP:3001` adresini açar; uyarıda "Ayrıntıları göster → bu web sitesini ziyaret et" de, sonra uygulamaya dön.
4. TV ekranında çıkan bağlantı isteğini kumandayla onayla.
5. Safari'de Paylaş → **Ana Ekrana Ekle**.

## Sınırlar

- Klavye yalnız TV'nin kendi ekran klavyesini kullanan yerlerde çalışır (web tarayıcısı, YouTube vb.). Netflix ve HBO Max gibi uygulamalar kendi klavyelerini çizdiği için dışarıdan yazı almaz.
- TV kapalıyken web sayfası TV'yi açamaz (tarayıcılar ağdan uyandırma sinyali gönderemez).

## Bilgisayardan yayınlama (isteğe bağlı)

`node serve.mjs` komutu `docs/` klasörünü ev ağında `http://BILGISAYAR-IP:8080` adresinden yayınlar. Bu yolda sertifika onayı gerekmez ve güç tuşu kapalı TV'ye açma sinyali gönderebilir (ayarlara TV'nin MAC adresi girilmeli).

## Teknik not

LG TV'ler yalnız kaynağı (Origin) boş ya da `null` olan bağlantıları kabul ediyor. Bu yüzden kumanda, `index.html` içindeki korumalı (sandbox) bir çerçevede (`remote.html`) çalışır; ayarlar dış sayfada saklanır.
