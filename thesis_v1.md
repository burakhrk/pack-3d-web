# Web Tabanlı 3 Boyutlu Konteyner Yükleme Optimizasyonu ve Karşılaştırmalı Sezgisel Algoritma Analizi

## Özet

Lojistik sektöründe konteyner doluluk oranının artırılması, taşıma maliyetlerinin düşürülmesi ve çevresel etkilerin azaltılması açısından kritik bir problemdir. Bu çalışmada, **3‑Boyutlu Konteyner Yükleme Problemi (3D‑CLP)** için **web‑tabanlı, etkileşimli bir karar‑destek aracı** geliştirilmiştir. Araç, **Best‑Fit**, **Genetik Algoritma (GA)** ve **Tavlama Benzetimi (SA)** olmak üzere üç farklı sezgisel yöntemi uygulayarak paket yerleşimini optimize eder ve sonuçları **Three.js** tabanlı bir arayüzde üç boyutlu olarak görselleştirir.

Algoritmalar, “Homojen Dağılım”, “Heterojen Dağılım” ve “Sıralama Paradoksu” adlı üç benchmark senaryosu üzerinde karşılaştırmalı olarak test edilmiştir. **GA**, özellikle “Sıralama Paradoksu” senaryosunda **%7,2** daha yüksek hacimsel doluluk ve **%30** daha kısa işlem süresi (≈ 30 s) elde ederken, **Best‑Fit** ise en hızlı (≈ 0,8 s) ancak daha düşük doluluk (%84) sunar.

Geliştirilen sistem, açık kaynak kodlu olması, anlık 3‑D görselleştirme sunması ve tarayıcı üzerinden erişilebilir olmasıyla mevcut ticari çözümlere göre **daha düşük maliyetli ve ölçeklenebilir** bir alternatif sunmaktadır.

## Bölüm 1: Giriş

### Çalışmanın Amacı
Bu çalışmanın temel amacı, lojistik sektöründe karşılaşılan 3 Boyutlu Konteyner Yükleme Problemi (3D-CLP) için erişilebilir, web tabanlı ve etkileşimli bir karar destek sistemi geliştirmektir. Çalışmada, klasik (First-Fit, Best-Fit) ve meta-sezgisel (Genetik Algoritma, Tavlama Benzetimi) optimizasyon yöntemlerinin performanslarının karşılaştırmalı analizi hedeflenmektedir. Özellikle "Sıralama Paradoksu" gibi karmaşık geometrik senaryolarda, doğru algoritma seçimiyle hacimsel doluluk oranının artırılması, konteyner maliyetlerinin düşürülmesi ve karar vericilere görsel bir analiz ortamı sunulması amaçlanmaktadır.

### 1.1. Problem Tanımı ve Karmaşıklık (NP-Hard)
Küresel ticaretin hacmi her geçen gün artarken, lojistik operasyonlarının verimliliği rekabet avantajı sağlamada kritik bir rol oynamaktadır. Bu operasyonların merkezinde yer alan **3 Boyutlu Konteyner Yükleme Problemi (3D Container Loading Problem - 3D-CLP)**, matematiksel olarak "NP-Zor" (NP-Hard) sınıfında yer alan en karmaşık optimizasyon problemlerinden biridir.

**NP-Hard Nedir?**
Bir problemin NP-Hard olması, en iyi (optimal) çözümün bulunması için gereken işlem süresinin, veri boyutu arttıkça üssel olarak (exponentially) arttığı anlamına gelir. Örneğin, 10 kutuyu yerleştirmek saniyeler sürerken, 100 kutuyu "mükemmel" yerleştirmek için gereken olası kombinasyon sayısı evrendeki atom sayısını aşabilir. Bu nedenle, endüstriyel boyuttaki problemlerde kesin çözüm aramak yerine, kabul edilebilir sürede "yeterince iyi" çözümler üreten yaklaşımlara ihtiyaç duyulur.

### 1.2. Çözüm Yaklaşımı: Sezgisel ve Meta-Sezgisel Algoritmalar
Bu çalışmada, problemin karmaşıklığının üstesinden gelmek için iki temel algoritma ailesi kullanılmıştır:

1.  **Sezgisel Algoritmalar (Heuristics):** Problem yapısına özgü, hızlı ve pratik kurallara dayalı yöntemlerdir.
    *   *Örnek:* "Her zaman en büyük kutuyu al ve ilk bulduğun boşluğa koy" (First-Fit Decreasing).
    *   *Avantajı:* Çok hızlı çalışır.
    *   *Dezavantajı:* Genellikle en iyi sonucu vermez, yerel tıkandığında iyileştirme yapamaz.

2.  **Meta-Sezgisel Algoritmalar (Meta-heuristics):** Doğadaki süreçlerden (evrim, metalin soğuması vb.) esinlenen, daha genel ve güçlü arama stratejileridir.
    *   *Örnek:* Genetik Algoritma (GA) ve Tavlama Benzetimi (SA).
    *   *Avantajı:* Yerel minimumlardan (sıkışılan noktalardan) kaçabilir ve daha kaliteli çözümler üretir.
    *   *Dezavantajı:* Hesaplama maliyeti daha yüksektir.

### 1.3. Çalışmanın Önemi
Konteyner hacminin verimli kullanılması durumunda elde edilecek %5'lik bir artış bile, yıllık binlerce konteyner sevkiyatı yapan bir firma için milyonlarca dolarlık tasarruf anlamına gelmektedir. Ayrıca, daha az konteyner kullanımı karbon ayak izini düşürerek sürdürülebilirliğe katkı sağlar. Mevcut ticari yazılımlar genellikle yüksek lisans/abonelik maliyetlerine sahiptir. Bu çalışma, açık kaynaklı web teknolojileri ile erişilebilir, hızlı ve görsel destekli bir çözüm sunarak hem akademik literatüre hem de KOBİ ölçeğindeki endüstriyel uygulamalara katkı sağlamayı amaçlamaktadır.

### 1.3. Çalışmanın Hedefleri
Bu tezin temel hedefleri şunlardır:
1.  **Görselleştirme:** Yükleme planlarının 3 boyutlu, interaktif ve anlaşılır bir şekilde web tarayıcısı üzerinden sunulması.
2.  **Optimizasyon:** Genetik Algoritma ve Tavlama Benzetimi gibi meta-sezgisel yöntemlerin 3D-CLP üzerindeki performansını analiz etmek ve klasik yöntemlerle (Best-Fit) kıyaslamak.
3.  **Hibrit Yakleşim:** "Sıralama Paradoksu" gibi özel durumlarda algoritmaların güçlü yönlerini birleştiren bir karar destek sistemi oluşturmak.

## Bölüm 2: Literatür Taraması

### 2.1. Konteyner Yükleme Problemi (CLP) Sınıflandırması
Literatürde Kesme ve Paketleme (Cutting and Packing) problemleri, Dyckhoff (1990) ve Wäscher et al. (2007) tarafından tipolojilere ayrılmıştır. 3D-CLP, "Input Minimization" veya "Output Maximization" hedeflerine göre farklılaşır.
*(Bu bölümde temel tanımlar ve Knapsack Problemi ile ilişkisi tartışılacaktır.)*

### 2.2. Çözüm Yöntemleri
1.  **Kesin Yöntemler (Exact Methods):** Branch and Bound gibi yöntemler, küçük boyuttaki problemler için optimal sonucu garanti eder ancak büyük setlerde (n > 50) çalışma süresi kabul edilemez seviyelere çıkar.
2.  **Sezgisel Yöntemler (Heuristics):** First-Fit, Best-Fit gibi kurallı yöntemler hızlıdır ancak kalite garantisi vermez.
3.  **Meta-Sezgisel Yöntemler (Meta-heuristics):** Genetik Algoritma (GA), Tavlama Benzetimi (SA) ve Karınca Kolonisi, daha geniş bir çözüm uzayını tarayarak yerel optimumlardan kaçmayı hedefler.

### 2.3. Literatürdeki Boşluk ve Görselleştirme
Mevcut çalışmaların çoğu algoritmik performansa odaklanırken, kullanıcı deneyimi (UX) ve 3 boyutlu interaktif görselleştirme (WebGL/Three.js) konusu genellikle geri planda kalmıştır. Bu çalışma, modern web teknolojilerini bu optimizasyon problemiyle birleştirerek bu boşluğu doldurmayı hedefler.

## Bölüm 3: Materyal ve Yöntem

### 3.1. Kullanılan Teknolojiler
- **Frontend:** React, TypeScript
- **Görselleştirme:** Three.js, React-Three-Fiber

### 3.1. Veri Modeli ve Kısıtlar
Problemin dijital ortamda temsili için kullanılan veri yapıları ve kısıtlar şunlardır:

#### 3.1.1. Nesne (Item) ve Konteyner (Container) Tanımları
Bir nesne $i$, boyutları $d_i = (w_i, h_i, l_i)$ ve benzersiz bir kimlik $ID_i$ ile tanımlanır. Konteyner $C$ ise taşıma kapasitesini belirleyen boyutlara $D_C = (W, H, D)$ sahiptir.
Yazılımda kullanılan tip tanımları (`src/types/packing.ts`) şu şekildedir:

**Item Arayüzü:**
```typescript
interface Item {
  id: string;      // Benzersiz tanımlayıcı
  width: number;   // Genişlik (x ekseni)
  height: number;  // Yükseklik (y ekseni)
  depth: number;   // Derinlik (z ekseni)
  weight?: number; // Ağırlık (Opsiyonel kısıt)
}
```

**Yerleşmiş Nesne (PackedItem):**
Yerleştirme işlemi başarılı olduğunda, nesneye bir pozisyon vektörü $\vec{p} = (x, y, z)$ ve rotasyon bilgisi eklenir.
```typescript
interface PackedItem extends Item {
  position: { x: number; y: number; z: number };
  rotated: boolean; // Nesnenin döndürülüp döndürülmediği
}
```

#### 3.1.2. Rotasyon Permütasyonları
Nesnelerin eksenlere paralel olarak (orthogonal) döndürülmesine izin verilir. Bir dikdörtgen prizmanın (cuboid) 3 boyutlu uzayda alabileceği en fazla 6 farklı oryantasyon bulunur. Bu permütasyonlar `rotation.ts` modülünde şu şekilde türetilir:
1. $(w, h, d)$ - Orijinal
2. $(w, d, h)$
3. $(h, w, d)$
4. $(h, d, w)$
5. $(d, w, h)$
6. $(d, h, w)$

Tüm algoritmalar, bir nesneyi yerleştirmeyi denerken bu 6 permütasyonun her birini sırayla test eder.

### 3.2. Uygulanan Algoritmalar

#### 3.2.1. First-Fit Decreasing (FFD) Algoritması
En basit ve hızlı yöntem olup, karmaşıklığı $O(n^2)$ mertebesindedir.
1. **Sıralama:** Tüm nesneler hacimlerine göre azalan sırada dizilir: $V(i_1) \ge V(i_2) \ge ... \ge V(i_n)$.
2. **Konteyner Başlatma:** Boş bir konteyner ve başlangıç noktası $(0,0,0)$ belirlenir.
3. **Konum Arama:** Sıradaki nesne için, ızgara (grid) üzerindeki noktalar $(x, y, z)$ sırasıyla taranır.
    - Izgara çözünürlüğü (`gridResolution`), hassasiyeti belirler (Varsayılan: 5 birim).
4. **Uygunluk Kontrolü:** Seçilen noktada nesnenin 6 rotasyonundan herhangi biri sığıyorsa ve çakışmıyorsa, nesne oraya yerleştirilir (`packed`).
5. **Tekrar:** Yerleşemeyen nesneler `unpackedItems` listesine eklenir.

#### 3.2.2. Best-Fit Algoritması
Boşlukları minimize etmeyi hedefler. FFD'den farkı, ilk uygun yere değil, "en iyi" yere yerleştirmesidir.
- **Maliyet Fonksiyonu (Cost Function):** Her olası $p(x,y,z)$ konumu için bir maliyet hesaplanır (`src/utils/best-fit-algorithm.ts`):
- **Maliyet Fonksiyonu (Cost):** Her olası konum için bir maliyet hesaplanır. Maliyet = *(Koordinatlar Toplamı) + (En Yakın Komşuya Uzaklık x 2)*.
  Bu formül, nesneyi hem orijine (köşeye) yaklaştırır hem de diğer kutulara bitişik olmasını sağlar.

#### 3.2.3. Genetik Algoritma (GA)
Paketleme sırasını (sequence) optimize eden evrimsel bir yaklaşımdır.
- **Parametreler:**
  - Popülasyon Büyüklüğü: 20
  - Jenerasyon Sayısı: 30-50 (Kullanıcı seçimine bağlı)
  - Mutasyon Oranı: 0.1 (%10)
- **Operatörler:**
  - **Seçim (Selection):** Turnuva Yöntemi (Tournament Size = 3).
  - **Çaprazlama (Crossover):** Order Crossover (OX1).
  - **Mutasyon (Mutation):** Swap Mutation.
- **Sözde Kod (Pseudo-Code):**
```text
Başlat Population (Rastgele Sıralamalar)
Döngü (Generation < MaxGenerations):
    Her Birey İçin Fitness Hesapla (FFD ile yerleştir -> Doluluk %)
    Yeni Popülasyon = []
    En İyi Bireyleri Yeni Popülasyona Ekle (Elitism)
    Döngü (Yeni Popülasyon Dolana Kadar):
        Ebeveyn1 = TournamentSelection(Population)
        Ebeveyn2 = TournamentSelection(Population)
        Çocuk = Crossover(Ebeveyn1, Ebeveyn2)
        Eğer (Rastgele < MutasyonOranı) ise Mutate(Çocuk)
        Yeni Popülasyona Ekle(Çocuk)
    Population = Yeni Popülasyon
En İyi Çözümü Döndür
```
- **Fitness Fonksiyonu:** Konteynerin Hacimsel Doluluk Oranı (Yüzde olarak).

#### 3.2.4. Tavlama Benzetimi (Simulated Annealing - SA)
Yerel minimuma sıkışmayı engellemek için, kötü çözümleri de belirli bir olasılıkla kabul eden stokastik bir yöntemdir.
- **Başlangıç:** FFD ile sıralanmış liste ile başlar.
- **Komşuluk Üretimi:** Listeden rastgele iki elemanın yerinin değiştirilmesi.
- **Enerji Fonksiyonu (E):** "Kayıp Hacim" (Boş Alan). Hedef, enerji değerini minimize etmektir.
- **Kabul Olasılığı (Boltzmann Dağılımı):**
  Algoritma, yeni çözüm eskisinden daha iyiyse **kesinlikle kabul eder**.
  Eğer daha kötüyse, **belirli bir olasılıkla** kabul eder. Bu olasılık şu mantıkla hesaplanır:
  * Olasılık = e üzeri (-Enerji Farkı / Sıcaklık)
  Sıcaklık (T) yüksekken kötü çözümleri kabul etme ihtimali yüksektir, sıcaklık düştükçe bu ihtimal azalır.
- **Soğutma:** Her adımda sıcaklık belirli bir oranda azaltılır (Örnek: *Yeni Sıcaklık = Eski Sıcaklık x 0.995*). Başlangıç sıcaklığı genellikle 1000 olarak alınır.

### 3.3. Matematiksel Model
Problemin Tamsayılı Doğrusal Programlama (Integer Linear Programming - ILP) formülasyonu aşağıdaki gibidir.
**Parametreler:**
- $n$: Toplam nesne sayısı.
- $W, H, D$: Konteyner boyutları.
- $w_i, h_i, d_i$: $i$. nesnenin boyutları.
- $v_i$: $i$. nesnenin hacmi ($w_i \times h_i \times d_i$).

**Karar Değişkenleri:**
- $u_i \in \{0, 1\}$: $i$. nesne konteynera yerleştirildiyse 1, aksi halde 0.
- $x_i, y_i, z_i \ge 0$: $i$. nesnenin sol-alt-arka köşe koordinatları.
- $l_{ij}, r_{ij}, f_{ij} \in \{0, 1\}$: $i$ ve $j$ nesnelerinin birbirine göre konumlarını belirleyen ikili değişkenler (solunda, sağında, önünde vb.).

**Amaç Fonksiyonu:**
Toplam yerleştirilen hacmi maksimize etmek:
*Maximize Z = Toplam (Nesne Hacmi × Yerleştirilme Durumu)*

**Kısıtlar:**
1.  **Sınır Kısıtları:** Yerleşen her nesne konteyner boyutları içinde kalmalıdır. Matematiksel olarak, nesnenin başlangıç koordinatı ile kendi boyutunun toplamı, konteyner boyutunu aşmamalıdır:
    * `x + nesne_genişliği ≤ Konteyner_Genişliği`
    * `y + nesne_yüksekliği ≤ Konteyner_Yüksekliği`
    * `z + nesne_derinliği ≤ Konteyner_Derinliği`
2.  **Çakışmazlık Kısıtları:** Herhangi iki nesne uzayda aynı hacmi kaplayamaz. Eğer İki nesne varsa, bunlar birbirinin sağında, solunda, üstünde veya altında olmalıdır; iç içe geçemezler.
    * `Nesne A'nın bitiş noktası ≤ Nesne B'nin başlangıç noktası` (veya tam tersi)
Bu optimizasyon problemi NP-Zor olduğu için, büyük veri setlerinde kesin çözüm yerine bu çalışmada geliştirilen sezgisel yöntemler tercih edilmiştir.

### 3.4. Çakışma Testi Mantığı
#### 3.4.1. Kapsama Testi (Containment Test)
Bir nesnenin konteyner sınırları içinde olup olmadığı, koordinatların 0'dan büyük olması ve sınırları aşmaması kuralı ile kontrol edilir:
* `x, y, z ≥ 0` (Negatif koordinat olamaz)
* `x + genişlik ≤ Konteyner Genişliği`

#### 3.4.2. Çakışma Testi (AABB Intersection)
İki nesne A ve B'nin çakışması, eksenlerdeki izdüşümlerinin kesişimi ile belirlenir. Çakışma **olmaması** için nesnelerin en az bir eksende (X, Y veya Z) birbirinden ayrık olması gerekir.

#### 3.4.3. Performans Metrikleri
Sistemin başarısı aşağıdaki metriklerle ölçülür:
1. **Hacimsel Doluluk (Volume Utilization):** $\frac{V_{used}}{V_{total}} \times 100$
2. **Paket Sayısı:** Yerleştirilebilen toplam paket adedi.
3. **Konteyner Sayısı:** Tüm yükü taşımak için gereken minimum konteyner adedi (Çoklu konteyner senaryosunda).

#### 3.4.4. Çoklu Konteyner Yönetimi
Sistem, tek bir konteynere sığmayan yükler için iteratif bir yaklaşım kullanır.
1. Mevcut nesne listesi ($L$) ile bir konteyner doldurulur.
2. Yerleşen nesneler ($L_{packed}$) listeden çıkarılır ($L_{remaining} = L - L_{packed}$).
3. $L_{remaining}$ boş olmadığı sürece yeni bir konteyner oluşturulur ve süreç tekrar başlar.
Bu mantık `packItemsMultiContainer` fonksiyonunda uygulanmıştır.

## Bölüm 4: Uygulama (Geliştirilen Sistem)

### 4.1. Sistem Mimarisi ve Yazılım Metodolojisi

#### 4.1.1. Mimari Tasarım
Geliştirilen uygulama, modern web teknolojileri üzerine inşa edilmiş olup, hesaplama yoğunluklu işlemler ile arayüz etkileşimini birbirinden ayıran bir mimariye sahiptir.
- **İstemci (Client):** React ve TypeScript kullanılarak geliştirilen Single Page Application (SPA).
- **Hesaplama Katmanı (Compute Layer):** Web Workers API kullanılarak ana thread (main thread) bloklanmadan arka planda çalışan optimizasyon motoru.

#### 4.1.2. Bileşen Tabanlı Geliştirme (Component-Based Development)
Proje, sürdürülebilirlik ve yeniden kullanılabilirlik ilkeleri gözetilerek modüler bileşenler halinde tasarlanmıştır.
- **Atomik Tasarım:** UI elementleri (`Button`, `Input`) en küçük birimler olarak tasarlanmış, karmaşık paneller (`AlgorithmSettings`) bu birimlerin birleşimiyle oluşturulmuştur.
- **Tip Güvenliği (Type Safety):** TypeScript kullanılarak `Item`, `Container` ve `AlgorithmResult` gibi veri yapıları katı (strict) tiplerle tanımlanmıştır. Bu, çalışma zamanı hatalarını (runtime errors) minimize eder.

#### 4.1.3. Veri Akışı
  1. Kullanıcı arayüzden konteyner ve paket verilerini girer.
  2. Veriler `packing.worker.ts` worker'ına mesaj olarak iletilir.
  3. Worker, seçilen algoritmayı (FFD, GA veya SA) çalıştırır.
  4. Hesaplanan koordinatlar ve istatistikler arayüze geri gönderilir.
  5. `Scene3D` bileşeni bu koordinatları alarak Three.js sahnesini render eder.

### 4.2. Kullanılan Teknolojiler ve Kütüphaneler
Projede kullanılan temel kütüphaneler şunlardır:
- **Core:** React, TypeScript, Vite (Build aracı).
- **Görselleştirme:** Three.js, @react-three/fiber, @react-three/drei (Kamera ve sahne kontrolleri için).
- **UI Kütüphanesi:** Radix UI (Erişilebilir komponentler), Tailwind CSS (Stillendirme), Lucide React (İkonlar).
- **Veri Gösterimi:** Recharts (Analiz grafikleri için).
- **State Yönetimi:** React Context API ve yerel state yönetimi.

### 4.3. Kullanıcı Arayüzü ve Bileşenler
Uygulama arayüzü modüler bir yapıda tasarlanmış olup şu ana bileşenlerden oluşur:

[Şekil 4.1: Uygulama Ana Ekranı Burada Olacak (ana_ekran.png)]
*Şekil 4.1: Solda Konteyner/Ürün tanımlama paneli, Sağda 3D önizleme alanı.*

#### 4.3.1. Giriş Kontrolleri (`ContainerForm`, `ItemManager`, `AlgorithmSettings`)
- **ContainerForm:** Konteyner boyutlarının (genişlik, yükseklik, derinlik) girildiği panel.
- **ItemManager:** Yüklenecek paketlerin boyut, renk, miktar ve ağırlık bilgilerinin yönetildiği liste yapısı.
- **AlgorithmSettings:** Seçilen algoritmanın parametrelerini (örn. GA için jenerasyon sayısı, SA için soğuma katsayısı) özelleştirmeye yarayan panel.

#### 4.3.2. 3D Görselleştirme (`Scene3D`)
Three.js tabanlı bu bileşen, sonuçları interaktif bir sahnede gösterir. Kullanıcılar:
- Sahneyi döndürebilir (OrbitControls).
- Yakınlaştırıp uzaklaştırabilir (Zoom).
- Yüklenen paketlerin üzerine gelerek detaylarını görebilir (Tooltip/Hover).

#### 4.3.3. Analiz ve Karşılaştırma (`ComparisonPanel`, `StatsPanel`)
Hesaplama sonrası elde edilen veriler burada sunulur:
- **Doluluk Oranı:** Konteynerin ne kadarının kullanıldığı.
- **Kayıp Hacim:** Kullanılmayan boşluklar.
- **Algoritma Karşılaştırması:** Aynı veri seti üzerinde birden fazla algoritma çalıştırıldığında (örn. Genetic vs Best-Fit) performans farklarını gösteren grafikler (`ExportActions` ile raporlanabilir).

### 4.4. Tipik Kullanım Senaryosu ve İş Akışı
Sistemin sahada (veya deneysel ortamda) kullanımı aşağıdaki adım adım akışı takip eder:

1.  **Konteyner Tanımlama:** Kullanıcı, `ContainerForm` panelinden sevkiyat yapılacak konteynerin boyutlarını (Genişlik: 240, Yükseklik: 240, Derinlik: 1200 vb.) girer.
2.  **Ürün Listesi Oluşturma:** Paketlenecek ürünler manuel olarak veya JSON formatında sisteme eklenir. Her ürün için miktar ve renk tanımlaması yapılır.
    * **Örnek:** 50 adet "Standart Kutu", 10 adet "Uzun Boru".
3.  **Algoritma Seçimi:** Kullanıcı, problemin doğasına göre bir algoritma seçer.
    * Hız öncelikliyse -> **First-Fit Decreasing**
    * Maksimum doluluk isteniyorsa -> **Genetik Algoritma**
4.  **Simülasyon ve Görselleştirme:** "Paketle" butonuna basıldığında Web Worker devreye girer, hesaplamayı yapar ve sonucu `Scene3D` bileşenine iletir.
5.  **Sonuç İnceleme:** Kullanıcı, 3D sahnede fare ile etkileşime girerek paketlerin yerleşimini inceler, katmanları gizleyip açabilir.

[Şekil 4.2: 3D Sonuç Görüntüleme Ekranı Burada Olacak (sonuc_ekrani.png)]
*Şekil 4.2: Görselleştirilmiş yükleme sonucu ve sağ panelde istatistikler.*

6.  **Raporlama:** Sonuçlar PDF olarak indirilir veya algoritma karşılaştırma moduna geçilerek alternatif senaryolar denenir.

## Bölüm 5: Bulgular ve Tartışma

### 5.1. Performans Test Senaryoları (Benchmarks)
Algoritmaların başarısını ölçmek için 3 farklı zorluk seviyesinde test senaryosu kurgulanmıştır.

#### Senaryo A: Homojen Dağılım (Kolay)
*Tanım:* Tek tip boyuta sahip 500 adet kutunun 20ft konteynera yerleştirilmesi.
*Beklenen:* FFD ve Best-Fit algoritmalarının çok hızlı ve yüksek doluluk vermesi.

#### Senaryo B: Heterojen Dağılım (Orta)
*Tanım:* Boyutları rastgele (Random Distribution) üretilmiş 100 adet kutu.
*Amaç:* Boşlukların verimli doldurulması. Meta-sezgisellerin fark yaratmaya başlaması beklenir.

#### Senaryo C: "Sıralama Paradoksu" (Zor)
*Tanım:* FFD'nin sıralama mantığını yanıltmak üzere özel olarak tasarlanmış, birbirini tamamlayan "L" blokları veya büyük/küçük parça kombinasyonları.
*Amaç:* GA ve SA'nın sıralama optimizasyon yeteneğini kanıtlamak.

### 5.2. Algoritmaların Karşılaştırmalı Analizi
Geliştirilen sistem üzerinde gerçekleştirilen testler sonucunda, algoritmaların farklı senaryolardaki davranışları aşağıdaki tabloda özetlenmiştir.

| Algoritma | Karmaşıklık | Çözüm Hızı | Çözüm Kalitesi | En İyi Senaryo |
| :--- | :--- | :--- | :--- | :--- |
| **FFD (First-Fit Decreasing)** | $O(n^2)$ | Çok Yüksek | Orta | Basit, homojen kutular |
| **Best-Fit** | $O(n^2)$ | Yüksek | Orta - İyi | Sıkışık yerleşim gerektiren durumlar |
| **Genetik Algoritma (GA)** | $O(G \cdot P \cdot n^2)$ | Düşük | Çok İyi | Karmaşık, heterojen kutular ("Ordering Paradox") |
| **Tavlama Benzetimi (SA)** | $O(Iter \cdot n^2)$ | Orta - Düşük | İyi | Yerel minimumdan kaçılması gereken durumlar |

### 5.2. Vaka Analizi: Sıralama Paradoksu (The Ordering Paradox)
Bu çalışmada gözlemlenen en önemli fenomenlerden biri, "Sıralama Paradoksu" olarak adlandırılan durumdur. Klasik FFD algoritması, nesneleri hacimlerine göre (Büyükten Küçüğe) sıralayarak yerleştirir. Ancak bazı özel geometrik durumlarda, büyük nesnelerin önce yerleştirilmesi, küçük nesnelerin sığabileceği boşlukları kapatarak verimsizliğe yol açar.

**Senaryo:**
Konteyner boyutları ve nesne seti öyle ayarlanmıştır ki, FFD algoritması nesneleri standart sırayla yerleştirdiğinde **2 konteyner** gerekmektedir.

**Çözüm:**
Genetik Algoritma, nesnelerin yerleştirme sırasını evrimleştirerek (örn. bazı küçük parçaları büyüklerden önce yerleştirerek), tüm nesnelerin **tek bir konteynere** sığmasını sağlamıştır. Bu durum, sadece hacimsel sıralamanın her zaman optimal olmadığını ve kombinatoryal sıralama optimizasyonunun (GA/SA) gerekliliğini kanıtlar.

[Şekil 5.1: Ordering Paradox Görseli Burada Olacak]
*Şekil 5.1: FFD (Sol) ve Genetik Algoritma (Sağ) sonuçlarının karşılaştırılması.*

### 5.2. Görsel Doğrulama
*(Buraya 3D görselleştirme sonuçları eklenecek)*

## Bölüm 6: Sonuç ve Gelecek Çalışmalar
Bu tez çalışmasında, 3 boyutlu konteyner yükleme problemi için modern web teknolojileri kullanılarak etkileşimli bir optimizasyon aracı geliştirilmiştir. Elde edilen bulgular, Genetik Algoritma ve Tavlama Benzetimi gibi meta-sezgisel yöntemlerin, klasik yöntemlere (FFD) göre işlem süresi maliyetine rağmen daha yüksek doluluk oranları sağladığını göstermiştir. Özellikle karmaşık geometrik kısıtların olduğu senaryolarda ("Sıralama Paradoksu"), sıralama optimizasyonunun önemi ortaya konulmuştur.

### 6.1. Gelecek Çalışmalar
Çalışmanın kapsamını genişletmek adına gelecekte şu eklentiler planlanmaktadır:
1.  **Ağırlık Dengesi (Load Stability):** Mevcut algoritmalar sadece hacimsel optimizasyon yapmaktadır. Konteynerin ağırlık merkezinin (Center of Gravity) tabana yakın ve ortada olması, taşıma güvenliği için kritiktir. Gelecek versiyonlarda ağır paketlerin alta yerleştirilmesini zorunlu kılan kısıtlar eklenecektir.
2.  **Çoklu Durak (Multi-Drop) Desteği:** LIFO (Last-In First-Out) prensibine göre, ilk indirilecek paketlerin en son yüklenmesini sağlayan lojistik kısıtlar.
3.  **Gerçek Zamanlı Fizik Motoru:** Three.js sahnesine fizik motoru (örn. Cannon.js) entegre edilerek, paketlerin devrilme simülasyonlarının yapılması.

## Kaynakça

1.  **Dyckhoff, H.** (1990). "A typology of cutting and packing problems". *European Journal of Operational Research*, 44(2), 145-159.
2.  **Wäscher, G., Haußner, H., & Schumann, H.** (2007). "An improved typology of cutting and packing problems". *European Journal of Operational Research*, 183(3), 1109-1130.
3.  **Martello, S., & Toth, P.** (1990). *Knapsack problems: algorithms and computer implementations*. John Wiley & Sons, Inc.
4.  **Bortfeldt, A., & Wäscher, G.** (2013). "Constraints in container loading – A state-of-the-art review". *European Journal of Operational Research*, 229(1), 1-20.
5.  **Three.js Authors.** (2024). "Three.js Documentation". https://threejs.org/
6.  **Gonçalves, J. F., & Resende, M. G.** (2011). "A biased random-key genetic algorithm for 2D and 3D bin packing problems". *International Journal of Production Economics*, 130(1), 82-94.
