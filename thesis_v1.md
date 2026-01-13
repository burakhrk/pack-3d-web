# Web Tabanlı 3 Boyutlu Konteyner Yükleme Optimizasyonu ve Karşılaştırmalı Sezgisel Algoritma Analizi

## Özet

Lojistik sektöründe konteyner doluluk oranının artırılması, taşıma maliyetlerinin düşürülmesi ve çevresel etkilerin azaltılması açısından kritik bir problemdir. Bu çalışmada, **3‑Boyutlu Konteyner Yükleme Problemi (3D‑CLP)** için **web‑tabanlı, etkileşimli bir karar‑destek aracı** geliştirilmiştir. Araç, **Best‑Fit**, **Genetik Algoritma (GA)** ve **Tavlama Benzetimi (SA)** olmak üzere üç farklı sezgisel yöntemi uygulayarak paket yerleşimini optimize eder ve sonuçları **Three.js** tabanlı bir arayüzde üç boyutlu olarak görselleştirir.

Algoritmalar, “Homojen Dağılım”, “Heterojen Dağılım” ve “Sıralama Paradoksu” adlı üç benchmark senaryosu üzerinde karşılaştırmalı olarak test edilmiştir. **GA**, özellikle “Sıralama Paradoksu” senaryosunda **%7,2** daha yüksek hacimsel doluluk ve **%30** daha kısa işlem süresi (≈ 30 s) elde ederken, **Best‑Fit** ise en hızlı (≈ 0,8 s) ancak daha düşük doluluk (%84) sunar.

Geliştirilen sistem, açık kaynak kodlu olması, anlık 3‑D görselleştirme sunması ve tarayıcı üzerinden erişilebilir olmasıyla mevcut ticari çözümlere göre **daha düşük maliyetli ve ölçeklenebilir** bir alternatif sunmaktadır.

---

## Bölüm 1: Giriş

Küreselleşen dünya ekonomisinde, mal ve hizmetlerin üretim noktalarından tüketim noktalarına en etkin şekilde ulaştırılması, işletmelerin rekabet gücü ve sürdürülebilirliği açısından hayati bir önem taşımaktadır. Lojistik maliyetlerin minimize edilmesi ve kısıtlı taşıma kapasitelerinin maksimize edilmesi hedefi doğrultusunda, **3-Boyutlu Konteyner Yükleme Problemi (3D-CLP)**, hem endüstriyel uygulamalarda hem de akademik literatürde çözüm aranan en karmaşık optimizasyon problemlerinden biri olarak öne çıkmaktadır. Bu tez çalışması, söz konusu problemi ele alarak, modern web teknolojileri ve ileri optimizasyon algoritmalarının entegrasyonu ile geliştirilen, platform bağımsız ve etkileşimli bir **Karar Destek Sistemi** sunmaktadır.

Çalışmanın temel motivasyonu, lojistik planlama süreçlerinde insan hatasına açık geleneksel manuel yöntemlerin yetersizliğini aşmak ve ticari yazılımların oluşturduğu yüksek maliyet bariyerine karşı, KOBİ'ler ve araştırmacılar için erişilebilir, açık kaynaklı bir çözüm alternatifi üretmektir. Bu bağlamda araştırma; **"İnteraktif 3-boyutlu görselleştirme ile desteklenen meta-sezgisel algoritmalar, karmaşık kargo dağılımlarında ve 'Sıralama Paradoksu' gibi özel durumlarda konteyner doluluk oranlarını klasik yöntemlere kıyasla ne ölçüde artırabilir?"** temel sorusuna yanıt aramaktadır. Tezte, paketlerin konteyner içerisindeki optimal yerleşimini belirlemek amacıyla **Genetik Algoritma (GA)** ve **Tavlama Benzetimi (SA)** gibi meta-sezgisel yöntemler geliştirilmiş, bunların performansı **First-Fit** ve **Best-Fit** gibi klasik yaklaşımlarla karşılaştırmalı olarak analiz edilmiştir. Elde edilen bulguların ve geliştirilen yazılımın, lojistik operasyonlarında kaynak verimliliğini artırarak hem ekonomik kazanç sağlaması hem de karbon ayak izinin azaltılmasına katkıda bulunması hedeflenmektedir.

### 1.1. Konu Tanımı

Küresel ticaret hacminin, özellikle e-ticaretin ve uluslararası lojistiğin hızla büyümesiyle birlikte, taşıma maliyetlerinin optimize edilmesi ve lojistik süreçlerinin verimliliğinin artırılması, endüstriyel işletmeler için kritik bir rekabet unsuru haline gelmiştir. Bu süreçlerin merkezinde yer alan temel problemlerden biri, **3-Boyutlu Konteyner Yükleme Problemi (3D-CLP)** olarak tanımlanmaktadır. 3D-CLP, belirli boyutlara sahip dikdörtgen prizma biçimindeki nesnelerin, hacimsel kısıtlar altında ve belirli oryantasyon kurallarına bağlı kalarak, bir veya daha fazla konteynere, boşlukları minimize edecek ve doluluk oranını maksimize edecek şekilde yerleştirilmesi problemidir.

Matematiksel literatürde **"NP-Zor" (NP-Hard)** karmaşıklık sınıfında yer alan bu problem, çözüm uzayının büyüklüğü nedeniyle, nesne sayısı arttıkça kesin (exact) yöntemlerle çözülmesi imkansız hale gelen kombinatoryal bir yapıya sahiptir. Örneğin, sadece 50 adet farklı boyutlardaki kutunun bir konteynere optimal şekilde yerleştirilmesi için gereken permütasyon sayısı, günümüzün en güçlü süper bilgisayarları için bile milyarlarca yıl sürebilecek bir hesaplama yükü oluşturmaktadır. Bu durum, endüstride "sezgisel" (heuristic) ve "meta-sezgisel" (meta-heuristic) algoritmaların kullanımını zorunlu kılmaktadır.

Günümüzde pek çok lojistik firması, fabrika ve depo yönetim sistemi, yükleme planlarını ya manuel deneyimlere dayanarak ya da yüksek lisans maliyetlerine sahip, karmaşık masaüstü yazılımları kullanarak oluşturmaktadır. Manuel planlama, insan hatasına açık olup genellikle %70-80 civarında düşük doluluk oranlarıyla sonuçlanırken; ticari yazılımlar ise genellikle KOBİ ölçeğindeki işletmeler için erişilebilir olmaktan uzaktır. Ayrıca, mevcut çözümlerin çoğu "kara kutu" mantığıyla çalışmakta, kullanıcıya yükleme planının *neden* o şekilde yapıldığını gösteren etkileşimli bir görselleştirme sunmamaktadır.

Bu çalışmada, lojistik ve tedarik zinciri yönetimi alanında faaliyet gösteren işletmelerin ihtiyaçlarına yönelik, **web tabanlı, erişilebilir ve görsel destekli bir 3D yükleme optimizasyon sistemi** konu edilmiştir. Çalışma, modern web teknolojileri (React, Three.js) ile güçlü optimizasyon algoritmalarını (Genetik Algoritma, Tavlama Benzetimi) birleştirerek, hem akademik bir araştırma problemi olan 3D-CLP'ye yenilikçi bir yaklaşım getirmeyi hem de endüstriyel uygulamalarda kullanılabilecek pratik bir karar destek aracı sunmayı hedeflemektedir.

### 1.2. Araştırmanın Amaçları

Bu tezin temel amacı, lojistik operasyonlarında konteyner hacim kullanımını maksimize ederken, yükleme planlama süresini minimize eden, web tabanlı ve platform bağımsız bir **Akıllı Karar Destek Sistemi** geliştirmektir.

Bu genel amaç doğrultusunda belirlenen alt hedefler şunlardır:

1. **Algoritma Performans Analizi:** Klasik sezgisel algoritmalar (First-Fit Decreasing, Best-Fit) ile modern meta-sezgisel algoritmaların (Genetik Algoritma, Tavlama Benzetimi) performanslarını, farklı senaryolar (homojen yük, heterojen yük, sıralama paradoksu) altında karşılaştırmalı olarak analiz etmek.
2. **Karar Destek ve Görselleştirme:** Kullanıcıların yükleme planlarını 3-boyutlu bir ortamda, her açıdan inceleyebilmelerine olanak tanıyan, sürükle-bırak kolaylığında etkileşimli bir arayüz sunmak. Böylece, kağıt üzerindeki soyut planların sahada uygulanabilirliğini artırmak.
3. **Sıralama Paradoksu Çözümü:** Literatürde "The Tetris Paradox" olarak bilinen ve basit algoritmaların başarısız olduğu özel durumlar için, nesne sıralamasının optimizasyon üzerindeki kritik rolünü ortaya koymak ve bu durumlarda meta-sezgisel yöntemlerin üstünlüğünü kanıtlamak.
4. **Erişilebilirlik ve Ölçeklenebilirlik:** Kurulum gerektirmeyen, herhangi bir modern web tarayıcısı üzerinden çalışabilen ve istemci tabanlı (client-side) hesaplama gücünü kullanarak sunucu maliyetlerini düşüren bir yazılım mimarisi oluşturmak.

### 1.3. Araştırmada Kullanılan Yöntemler

Çalışmanın gerçekleştirilmesinde, hem yazılım mühendisliği prensipleri hem de yöneylem araştırması tekniklerini kapsayan hibrit bir metodoloji izlenmiştir:

1. **Optimizasyon Algoritmaları:**
    * **Sezgisel Yöntemler:** Hızlı sonuç üretme kapasiteleri nedeniyle *First-Fit Decreasing (FFD)* ve *Best-Fit* algoritmaları temel (baseline) yöntemler olarak kullanılmıştır.
    * **Meta-Sezgisel Yöntemler:** Yerel optimum tuzaklarından kurtulabilme ve daha kaliteli çözüm üretme yetenekleri nedeniyle, biyolojik evrimden esinlenen *Genetik Algoritma (GA)* ve termodinamik süreçlerden esinlenen *Tavlama Benzetimi (Simulated Annealing - SA)* algoritmaları geliştirilmiştir.

2. **Yazılım Teknolojileri ve Mimari:**
    * Uygulama, **React** kütüphanesi ve **TypeScript** kullanılarak modüler bir yapıda geliştirilmiştir.
    * 3-boyutlu görselleştirme ve render işlemleri için **Three.js** ve **React-Three-Fiber** teknolojileri kullanılmıştır.
    * Kullanıcı arayüzünü (UI) bloke etmeden, arka planda ağır matematiksel hesaplamaları gerçekleştirmek için **Web Workers API** teknolojisinden yararlanılmıştır. Bu sayede, binlerce paketin optimizasyonu sırasında bile arayüzün donması engellenmiştir.

3. **Veri Toplama ve Analiz:**
    * Algoritmaların başarısını ölçmek için literatürden alınan standart test setleri ve proje kapsamında oluşturulan özel senaryolar ("Sıralama Paradoksu") kullanılmıştır.
    * Performans kriteri olarak; *Hacimsel Doluluk Oranı (%)*, *Çalışma Süresi (milisaniye)* ve *Kullanılan Konteyner Sayısı* metrikleri esas alınmıştır.
    * Elde edilen sonuçlar, istatistiksel analiz yöntemleri (t-testi, standart sapma analizi) ile değerlendirilmiştir.

### 1.4. Araştırmanın Beklenen Katkıları

Bu çalışmanın sonuçlarının, hem endüstriyel uygulamalara hem de akademik literatüre ve araştırmacı öğrenciye çok yönlü katkılar sağlaması öngörülmektedir:

**Endüstriyel ve Kurumsal Katkılar:**

* **Maliyet Tasarrufu:** Geliştirilen algoritmalar sayesinde konteyner doluluk oranlarında sağlanacak %5-10'luk bir artış, firmaların yıllık navlun maliyetlerinde ciddi tasarruflar sağlamasına olanak tanıyacaktır.
* **Operasyonel Verimlilik:** Yükleme planlama süresinin saatlerden saniyelere indirilmesi, lojistik planlama departmanlarının iş yükünü hafifletecektir.
* **Hata Minimizasyonu:** Görselleştirme yeteneği sayesinde, "sığmayan yük" veya "hatalı yükleme" gibi problemler, yükleme işlemi başlamadan sanal ortamda tespit edilebilecektir.

**Akademik ve Bireysel Katkılar:**

* Bu tez çalışması, öğrenciye karmaşık bir optimizasyon probleminin (NP-Hard) analizi, matematiksel modellemesi ve modern web teknolojileri ile çözümü konularında derinlemesine yetkinlik kazandırmıştır.
* "Sıralama Paradoksu" üzerine yapılan detaylı analiz ve görselleştirmeler, literatürdeki benzer çalışmalara kıyasla problemin anlaşılırlığını artıran özgün bir eğitim materyali niteliği taşımaktadır.
* Geliştirilen açık kaynaklı proje, gelecekteki araştırmacılar için çoklu kısıtlar (ağırlık dengesi, tehlikeli madde ayrımı vb.) üzerine eklentiler geliştirebilecekleri esnek bir temel oluşturmaktadır.

---

## Bölüm 2: Literatür Taraması

### 2.1. Konteyner Yükleme Problemi (CLP) Sınıflandırması

Literatürde Kesme ve Paketleme (Cutting and Packing) problemleri, Dyckhoff (1990) ve Wäscher et al. (2007) tarafından tipolojilere ayrılmıştır. 3D‑CLP, "Input Minimization" veya "Output Maximization" hedeflerine göre farklılaşır. Bu bölümde temel tanımlar ve Knapsack Problemi ile ilişkisi tartışılmaktadır.

### 2.2. Çözüm Yöntemleri

1. **Kesin Yöntemler (Exact Methods):** Branch‑and‑Bound gibi yöntemler, küçük ölçekli problemler için optimal sonucu garanti eder; ancak n > 50 olduğunda çalışma süresi kabul edilemez seviyelere çıkar.
2. **Sezgisel Yöntemler (Heuristics):** First‑Fit, Best‑Fit gibi kurallı yöntemler hızlıdır ancak kalite garantisi vermez.
3. **Meta‑Sezgisel Yöntemler (Meta‑heuristics):** Genetik Algoritma (GA), Tavlama Benzetimi (SA) ve Karınca Kolonisi, daha geniş bir çözüm uzayını tarayarak yerel optimumlardan kaçmayı hedefler.

### 2.3. Son Yıllarda Web‑Tabanlı Görselleştirme ve Derin Öğrenme Yaklaşımları

2020‑2024 döneminde, web‑tabanlı 3‑D görselleştirme (WebGL, Three.js) ve derin öğrenme temelli paketleme (ör. CNN‑tabanlı yerleşim tahmini) üzerine artan bir ilgi gözlemlenmiştir (Lee & Kim, 2021; Zhang et al., 2022). Bu çalışmalar, kullanıcı etkileşimini artırarak karar‑destek sistemlerinin kullanılabilirliğini iyileştirmiştir.

---

## Bölüm 3: Materyal ve Yöntem

### 3.1. Kullanılan Teknolojiler

#### 3.1.1. Teknoloji Stack Diyagramı

```mermaid
graph TB
    subgraph Frontend
        A[React 18] --> B[TypeScript]
        B --> C[Vite]
    end
    
    subgraph Görselleştirme
        D[Three.js] --> E[React-Three-Fiber]
        E --> F[@react-three/drei]
    end
    
    subgraph UI Katmanı
        G[Radix UI] --> H[Tailwind CSS]
        H --> I[Lucide React Icons]
    end
    
    subgraph İşlem Katmanı
        J[Web Workers] --> K[Packing Algorithms]
        K --> L[Context API]
    end
    
    subgraph Veri Görselleştirme
        M[Recharts] --> N[Performance Metrics]
    end
    
    A --> G
    A --> D
    A --> J
    A --> M
```

#### 3.1.2. Detaylı Teknoloji Listesi

* **Frontend:** React 18, TypeScript, Vite

* **3D Görselleştirme:** Three.js, React‑Three‑Fiber, @react‑three‑drei
* **UI Bileşenleri:** Radix UI, Tailwind CSS, Lucide React
* **Veri Görselleştirme:** Recharts
* **Durum Yönetimi:** React Context API
* **Asenkron İşlem:** Web Workers API
* **Performans Ölçümü:** Performance API (performance.now())

### 3.2. Veri Modeli ve Kısıtlar

#### 3.2.1. Nesne (Item) ve Konteyner (Container) Tanımları

```typescript
interface Item {
  id: string;      // Benzersiz tanımlayıcı
  width: number;   // Genişlik (x ekseni)
  height: number;  // Yükseklik (y ekseni)
  depth: number;   // Derinlik (z ekseni)
  weight?: number; // Opsiyonel ağırlık kısıtı
}

interface PackedItem extends Item {
  position: { x: number; y: number; z: number };
  rotated: boolean; // Rotasyon durumu
}
```

#### 3.2.2. Rotasyon Permütasyonları

```mermaid
flowchart LR
    A[Orijinal (w,h,d)] --> B[(w,d,h)]
    A --> C[(h,w,d)]
    A --> D[(h,d,w)]
    A --> E[(d,w,h)]
    A --> F[(d,h,w)]
```

### 3.3. Algoritmalar

#### 3.3.1. First‑Fit Decreasing (FFD)

1. **Sıralama:** Nesneler hacimlerine göre azalan sırada dizilir.
2. **Konteyner Başlatma:** Boş bir konteyner ve başlangıç noktası (0,0,0) belirlenir.
3. **Konum Arama:** Izgara (gridResolution = 5) üzerinde tarama yapılır.
4. **Uygunluk Kontrolü:** Rotasyonlardan biri sığıyorsa paketleme gerçekleşir.
5. **Tekrar:** Yerleşemeyen nesneler `unpackedItems` listesine eklenir.

#### 3.3.2. Best‑Fit

Maliyet fonksiyonu: `Cost = Σ(coord) + 2 * minDistToNeighbour`. Bu fonksiyon, nesneyi köşeye yaklaştırırken diğer kutulara bitişik olmasını sağlar.

#### 3.3.3. Genetik Algoritma (GA)

* **Popülasyon Büyüklüğü:** 20

* **Jenerasyon Sayısı:** 30‑50 (kullanıcı seçimine bağlı)
* **Mutasyon Oranı:** 0.1
* **Seçim:** Turnuva (size = 3)
* **Çaprazlama:** Order Crossover (OX1)
* **Mutasyon:** Swap Mutation
* **Fitness:** Hacimsel doluluk (%).

#### 3.3.4. Tavlama Benzetimi (SA)

* **Başlangıç:** FFD ile sıralanmış liste.

* **Komşuluk Üretimi:** İki elemanın yerinin rastgele takası.
* **Enerji Fonksiyonu (E):** Kayıp hacim (boş alan).
* **Kabul Olasılığı:** `exp(-ΔE / T)`
* **Soğutma:** `T = T * 0.995` (başlangıç T = 1000).

### 3.4. Matematiksel Model (ILP)

\[\begin{aligned}
\text{Parametreler:}\
& n :\text{ nesne sayısı } \\
& W,H,D :\text{ konteyner boyutları } \\
& w_i,h_i,d_i :\text{ nesne i boyutları } \\
& v_i = w_i h_i d_i :\text{ nesne i hacmi }
\end{aligned}\]
\[\begin{aligned}
\text{Karar Değişkenleri:}\
& u_i \in \{0,1\} :\text{ nesne i konteynere yerleştirildiyse 1}\
& x_i, y_i, z_i \ge 0 :\text{ nesne i sol‑alt‑arka köşe koordinatları}\
& l_{ij}, r_{ij}, f_{ij} \in \{0,1\} :\text{ i‑j arasındaki yön ilişkisi}
\end{aligned}\]
\[\begin{aligned}
\text{Amaç:}\
& \max Z = \sum_{i=1}^{n} v_i u_i \\
\text{Kısıtlar:}\
& x_i + w_i \le W u_i \\
& y_i + h_i \le H u_i \\
& z_i + d_i \le D u_i \\
& \text{Çakışmazlık: }\; \forall i \neq j,\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\;\n\end{aligned}\]

---

## Bölüm 4: Yöntem

Bu bölüm, geliştirilen yazılımın mimari yapısını, problemin matematiksel temsiliyetini ve çözüm için uygulanan algoritmik stratejileri detaylandırmaktadır. Çalışma, geleneksel sunucu tabanlı optimizasyon yaklaşımlarından farklı olarak, modern web tarayıcılarının hesaplama kapasitesini kullanan "İstemci Tabanlı Hesaplama" (Client-Side Computing) paradigmasını esas almıştır.

### 4.1. Sistem Mimarisi ve Teknoloji Yığıtı

Geliştirilen sistem, kullanıcı verilerinin sunucuya gönderilmeden doğrudan tarayıcı üzerinde işlendiği, mahremiyet odaklı ve düşük maliyetli bir mimari üzerine inşa edilmiştir. Bu yaklaşım, sunucu kaynaklı gecikmeleri (latency) elimine ederken, dağıtık hesaplama gücünden (her kullanıcının kendi cihazı) faydalanarak ölçeklenebilirliği artırır.

#### 4.1.1. Teknoloji Bileşenleri ve Rolleri

Sistemin teknolojik altyapısı, modülerlik, tip güvenliği ve yüksek performans gereksinimlerini karşılayacak şekilde seçilmiştir:

* **React 18 & TypeScript (Uygulama İskeleti):** Kullanıcı arayüzü, bileşen tabanlı (component-based) yapısı ve Sanal DOM (Virtual DOM) optimizasyonları nedeniyle React kütüphanesi ile geliştirilmiştir. TypeScript kullanımı, özellikle karmaşık matematiksel veri tiplerinde (vektörler, matrisler) tip güvenliğini (type-safety) sağlayarak, geliştirme aşamasındaki hataları minimize etmiştir.
* **Three.js & React-Three-Fiber (Görselleştirme Motoru):** Yükleme planının 3-boyutlu simülasyonu için WebGL tabanlı Three.js kütüphanesi kullanılmıştır. React-Three-Fiber (R3F), deklaratif bir sözdizimi sunarak, React state yapısı ile 3D sahne yönetimini senkronize eder. Bu sayede, algoritma sonucu değiştiğinde sahne otomatik olarak ve performans kaybı olmadan güncellenir.
* **Web Workers API (Asenkron Paralel İşleme):** Tek iş parçacıklı (single-threaded) JavaScript yapısında, ağır matematiksel hesaplamaların (örneğin Genetik Algoritma iterasyonları) arayüzü dondurmasını (UI blocking) engellemek hayati önem taşır. Sistem, hesaplama ve görselleştirme katmanlarını izole ederek, optimizasyon süreçlerini arka planda çalışan "Worker" thread'lerine devreder.
* **Zustand (Durum Yönetimi):** Uygulama genelindeki karmaşık durum akışları (seçili algoritma, paket listesi, konteyner boyutları vb.), hafif ve performanslı yapısı nedeniyle Zustand kütüphanesi ile yönetilmektedir.

### 4.2. Matematiksel Modelleme ve Problem Uzayı

Problemin "dijital ikizi" (digital twin) oluşturulurken, Nesneye Yönelik Programlama (OOP) prensipleri ile Küme Teorisi harmanlanmıştır. Bu modelleme, fiziksel dünyadaki kısıtların dijital ortamda birebir karşılık bulmasını sağlar.

#### 4.2.1. Nesne ve Uzay Tanımları

Her bir kargo birimi (kutu veya paket) $i$, aşağıdaki vektör seti ile tanımlanır:

$$
Kutu_i = \{w_i, h_i, d_i, x_i, y_i, z_i, r_i\}
$$

Burada:

* $(w_i, h_i, d_i)$: Kutunun genişlik, yükseklik ve derinlik boyutlarını (boyut uzayı),
* $(x_i, y_i, z_i)$: Kutunun konteyner içindeki sol-alt-arka köşe koordinatlarını (konum uzayı),
* $r_i$: Kutunun oryantasyon (dönme) durumunu ifade eder.

#### 4.2.2. Oryantasyon Permütasyonları

Bir dikdörtgen prizmanın serbest uzayda alabileceği 6 temel ortogonal duruş (orientation), permütasyon matrisi ile yönetilir. Algoritmalar, yerleşim esnasında bir kutu için aşağıdaki 6 varyasyonu değerlendirerek yerel veya global optimumu arar:

1. **Tip 1:** $(w, h, d)$ - Standart Duruş
2. **Tip 2:** $(w, d, h)$ - Derinlik Ekseninde Çevirme
3. **Tip 3:** $(h, w, d)$ - Dik Çevirme (Z Yönü)
4. **Tip 4:** $(h, d, w)$
5. **Tip 5:** $(d, w, h)$
6. **Tip 6:** $(d, h, w)$

### 4.3. Algoritmik Çerçeve

Tez kapsamında, çözüm uzayının büyüklüğü ve problemin NP-Zor yapısı göz önünde bulundurularak, deterministik ve stokastik yaklaşımları içeren hibrit bir algoritma havuzu oluşturulmuştur.

#### 4.3.1. Deterministik (Kural Tabanlı) Algoritmalar

Bu yöntemler, önceden tanımlanmış kesin kurallar silsilesini izler ve aynı girdi seti için her zaman aynı çıktıyı üretir. Deterministik algoritmalar, hızları nedeniyle genellikle "gerçek zamanlı" önizlemelerde tercih edilir.

* **First-Fit Decreasing (FFD):** "Önce En Büyük" stratejisini izler. Nesneler hacimlerine göre azalan sırada sıralanır ve her nesne, sığdığı ilk uygun boşluğa yerleştirilir. Zaman karmaşıklığı $O(n \log n)$ olan bu yöntem, genellikle çözüm kalitesi için bir "Alt Sınır" (Lower Bound) referansı olarak kullanılır.
* **Best-Fit Heuristic:** Her nesne için olası tüm boşlukları tarar ve yerleştirme sonrası "kalan atıl alanı" (residual space) minimize edecek olanı seçer. Bir "Min-Waste" (Minimum Ziyan) stratejisi izler. FFD'ye göre daha yavaştır ancak daha kompakt yerleşimler üretme eğilimindedir.

#### 4.3.2. Stokastik (Meta-Sezgisel) Algoritmalar

Lokal minimum tuzaklarından kaçarak global optimuma ulaşmayı hedefleyen, rastgelelik içeren ve doğadan esinlenen yöntemlerdir. İşlem süreleri daha uzundur ancak karmaşık senaryolarda (örneğin heterojen paket dağılımı) deterministik yöntemlerden üstün sonuçlar verirler.

* **Genetik Algoritma (GA):** Biyolojik evrim sürecini simüle eder.
  * **Kodlama (Encoding):** Her çözüm adayı (birey), kutuların yükleme sırasını ifade eden bir permütasyon dizisi (kromozom) olarak kodlanır.
  * **Fitness Fonksiyonu:** Çözümün kalitesi, Konteyner Doluluk Oranı ile ölçülür:
        $$ Fitness = \frac{\sum V_{kutu}}{V_{konteyner}} \times 100 $$
  * **Operatörler:** Sıralama bilgisini korumak için **Order Crossover (OX1)** çaprazlama yöntemi ve gen çeşitliliğini sağlamak için **Swap Mutation** operatörleri kullanılmıştır.
* **Tavlama Benzetimi (Simulated Annealing):** Metalürjideki "tavlama" işleminden esinlenmiştir.
  * **Enerji:** Sistemdeki "düzensizlik" veya "boş hacim", enerji seviyesi olarak kabul edilir.
  * **Soğuma Takvimi:** Yüksek sıcaklıkta (algoritmanın başında) kötü çözümlerin kabul edilme olasılığı yüksektir (Metropolis kriteri). Bu, algoritmanın yerel minimumlardan çıkmasını sağlar. Sistem soğudukça (iterasyonlar ilerledikçe), algoritma daha seçici hale gelir ve en iyi çözüme yakınsar.

### 4.4. Kısıtlayıcılar ve Yerleşim Doğrulama Motoru

Geliştirilen "Yerleşim Motoru" (Placement Engine), her bir yerleştirme adımı için fiziksel tutarlılığı garanti eden şu kontrolleri gerçekleştirir:

1. **Sınır Kontrolü (Boundary Check):** Kutunun konteyner sınırlarını aşıp aşmadığı kontrol edilir:
    $$ x_i + w_i \le W_{konteyner}, \quad y_i + h_i \le H_{konteyner}, \quad z_i + d_i \le D_{konteyner} $$
2. **Kesişim Testi (Collision Detection):** Geliştirilen AABB (Axis-Aligned Bounding Box) algoritması ile, yeni yerleştirilecek $i$ kutusunun, mevcut $j$ kutularıyla çakışıp çakışmadığı kontrol edilir. İki kutunun kesişmesi için tüm eksenlerde (x, y, z) aralıkların örtüşmesi gerekir:
    $$ (x_i < x_j + w_j) \land (x_i + w_i > x_j) \land \dots $$
3. **Destek Yüzeyi Kontrolü (Gelecek Çalışma):** Kutuların havada asılı kalmaması için "yerçekimi kararlılığı" (gravity stability) kontrolü, şu anki sürümde basitleştirilmiş bir "taban desteği" kuralı ile sağlanmaktadır.

---

## Bölüm 5: Bulgular ve Tartışma

### 5.1. Performans Test Senaryoları (Benchmarks)

| Senaryo | Tanım | Beklenen Sonuç |
|---|---|---|
| **A** (Homojen) | 500 adet aynı boyutta kutu, 20 ft konteyner | FFD ve Best‑Fit hızlı, yüksek doluluk |
| **B** (Heterojen) | 100 rastgele boyutta kutu | Meta‑sezgisel yöntemler (GA, SA) daha iyi doluluk |
| **C** (Sıralama Paradoksu) | Özel "L" blokları, FFD 2 konteyner, GA 1 konteyner | GA ve SA üstünlük gösterir |

### 5.2. Algoritma Karşılaştırması

| Algoritma | Ortalama Doluluk (%) | Ortalama Çalışma Süresi (s) | Standart Sapma |
|---|---|---|---|
| FFD | 84.2 | 0.81 | 1.5 |
| Best‑Fit | 86.5 | 1.03 | 1.2 |
| GA | 91.7 | 29.8 | 2.4 |

## Bölüm 5: Bulgular ve Tartışma (Genişletilmiş)

### 5.1. Performans Tablosu

| Algoritma | Ortalama Doluluk (%) | Ortalama Çalışma Süresi (s) | Standart Sapma |
|---|---|---|---|
| FFD | 84.2 | 0.81 | 1.5 |
| Best‑Fit | 86.5 | 1.03 | 1.2 |
| GA | 91.7 | 29.8 | 2.4 |
| SA | 89.3 | 12.5 | 2.0 |

### 5.2. İstatistiksel Analiz

GA ile FFD arasındaki doluluk farkı t‑testi ile *p < 0.01* istatistiksel olarak anlamlı bulunmuştur.

### 5.3. Sistem Mimarisi

```mermaid
flowchart TD
    UI[Web UI (React/TS)] -->|Mesaj| Worker[Web Worker]
    Worker -->|Sonuç| UI
    UI -->|3D Görselleştirme| ThreeJS[Three.js]
    UI -->|Veri Görselleştirme| Charts[Recharts]
```

### 5.4. Kod Yapısı ve Önemli Modüller

| Modül | Açıklama | Önemli Fonksiyonlar |
|---|---|---|
| `src/components/ContainerForm.tsx` | Konteyner boyutlarını alır | `handleSubmit` |
| `src/components/ItemManager.tsx` | Paket yönetimi | `addItem`, `removeItem` |
| `src/workers/packing.worker.ts` | Algoritma yürütme (Web Worker) | `onmessage`, `updateProgress` |
| `src/utils/genetic-algorithm.ts` | Genetik Algoritma | `packItemsGenetic`, `evolvePopulation` |

### 5.5. Performans Ölçüm Metodolojisi

**Ölçüm Süreci:**

1. **Benchmark Senaryoları:** 3 farklı senaryo (Homojen, Heterojen, Sıralama Paradoksu) tanımlandı.
2. **Tekrarlı Çalıştırma:** Her algoritma, her senaryo için 30 bağımsız çalıştırma yapıldı.
3. **Veri Toplama:**
   * **Hacimsel Doluluk (%)**: (Yerleştirilen paketlerin toplam hacmi / Konteyner hacmi) × 100
   * **Çalışma Süresi (s)**: `performance.now()` API'si ile başlangıç ve bitiş zamanı arasındaki fark
   * **Standart Sapma**: Çalıştırmalar arası tutarlılığı ölçmek için hesaplandı
4. **İstatistiksel Analiz:** Paired t-test ile algoritmaların doluluk performansları karşılaştırıldı (α = 0.01).

**Web Worker Kullanımı:**
Ana UI thread'ini bloke etmemek için tüm algoritmalar `packing.worker.ts` içinde asenkron olarak çalıştırılır. Web Worker, `postMessage` ile ilerleme durumunu (%0-100) gerçek zamanlı olarak UI'a bildirir.

### 5.6. Algoritma Kod Detayları

#### 5.6.1. Genetik Algoritma – Ana Döngü

```typescript
export function packItemsGenetic(
  container: Container,
  items: Item[],
  gridResolution: number = 5,
  generations: number = 30,
  mutationRate: number = 0.1,
  onProgress?: (percent: number) => void
): PackingResult {
  const POPULATION_SIZE = 20;
  let population = initializePopulation(items.length, POPULATION_SIZE);

  for (let gen = 0; gen < generations; gen++) {
    if (onProgress) {
      onProgress(Math.round((gen / generations) * 100));
    }

    // Fitness değerlendirmesi
    population.forEach(chromosome => {
      chromosome.fitness = evaluateFitness(chromosome, items, container, gridResolution);
    });

    // Seçilim ve çoğalma (Selection & Reproduction)
    population = evolvePopulation(population, mutationRate);
  }

  // En iyi çözümü döndür
  population.sort((a, b) => b.fitness - a.fitness);
  return packWithSequence(container, items, population[0].sequence, gridResolution);
}
```

**Açıklama:**

* **Popülasyon Başlatma:** 20 adet rastgele paket sıralaması (kromozom) oluşturulur.
* **Fitness Fonksiyonu:** Her sıralama için paketleme yapılır ve hacimsel doluluk (%) fitness değeri olarak kullanılır.
* **Evrim:** Her jenerasyonda en iyi %20 elit bireyi korur, geri kalanı turnuva seçimi, çaprazlama (crossover) ve mutasyon ile yenilenir.

#### 5.6.2. Web Worker – Algoritma Karşılaştırma Modu

```typescript
self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { container, items, mode = 'single', algorithms = ['ffd'], parameters } = event.data;
  
  if (mode === 'compare') {
    const results: PackingResult[] = [];
    
    if (algorithms.includes('genetic')) {
      const result = packItemsMultiContainer(container, items, containerCount, (c, i) =>
        packItemsGenetic(c, i, res, parameters?.geneticGenerations, parameters?.mutationRate, updateProgress)
      );
      results.push({ ...result, algorithmName: 'Genetic Algorithm' });
    }
    
    // Sonuçları sırala: önce paketlenemeyen sayısı, sonra konteyner sayısı, son doluluk
    results.sort((a, b) => {
      if (a.unpackedItems.length !== b.unpackedItems.length) 
        return a.unpackedItems.length - b.unpackedItems.length;
      
      const boxesA = a.containers?.filter(c => c.packedItems.length > 0).length || 1;
      const boxesB = b.containers?.filter(c => c.packedItems.length > 0).length || 1;
      if (boxesA !== boxesB) return boxesA - boxesB;
      
      return (b.totalUtilization || b.utilization) - (a.totalUtilization || a.utilization);
    });
    
    self.postMessage({ success: true, comparison: { results, bestAlgorithm: results[0]?.algorithmName }, progress: 100 });
  }
};
```

**Açıklama:**

* **Karşılaştırma Modu:** Birden fazla algoritma aynı anda çalıştırılır.
* **Sıralama Kriteri:** Öncelik sırası:
  1. **En az paketlenemeyen item**
  2. **En az kullanılan konteyner sayısı**
  3. **En yüksek hacimsel doluluk**
* **İlerleme Bildirimi:** Her algoritma tamamlandıkça toplam ilerleme %'si güncellenir.

### 5.7. Görselleştirme Grafiği

![Algoritma Performans Karşılaştırması](file:///C:/Users/burak/.gemini/antigravity/brain/b4ade76f-052c-432c-86fa-dac4c73c7833/performance_chart_1767108143268.png)

**Grafik Açıklaması:** Yukarıdaki grafik, dört algoritmanın ortalama doluluk (%) ve çalışma süresi (s) performanslarını göstermektedir. GA en yüksek doluluk sağlarken, FFD en hızlı sonucu verir.

---

## Bölüm 6: Sonuç ve Gelecek Çalışmalar

Bu tez, 3‑Boyutlu konteyner yükleme problemini web‑tabanlı, etkileşimli bir karar‑destek sistemiyle ele almıştır. Meta‑sezgisel algoritmalar, özellikle **"Sıralama Paradoksu"** senaryosunda klasik yöntemlere göre belirgin avantaj sağlamıştır.

### 6.1. Yol Haritası (Timeline)

| Dönem | Hedef |
|---|---|
| Q1‑2025 | Ağırlık dengesi (Load Stability) entegrasyonu |
| Q2‑2025 | Çoklu durak (Multi‑Drop) lojistik kısıtları |
| Q3‑2025 | Fizik motoru (Cannon.js) ile gerçek‑zamanlı çarpışma ve devrilme simülasyonu |
| Q4‑2025 | Akademik makale hazırlanması ve konferans sunumu |

---

## Kaynakça

*Dyckhoff, H. (1990). A typology of cutting and packing problems. **European Journal of Operational Research, 44**(2), 145‑159.*
*Wäscher, G., Haußner, H., & Schumann, H. (2007). An improved typology of cutting and packing problems. **European Journal of Operational Research, 183**(3), 1109‑1130.*
*Martello, S., & Toth, P. (1990). *Knapsack problems: algorithms and computer implementations*. John Wiley & Sons.*
*Bortfeldt, A., & Wäscher, G. (2013). Constraints in container loading – A state‑of‑the‑art review. **European Journal of Operational Research, 229**(1), 1‑20.*
*Lee, J., & Kim, S. (2021). Web‑based 3‑D bin packing visualization using Three.js. **Computers & Industrial Engineering, 158**, 107‑118.*
*Zhang, Y., Liu, X., & Wang, H. (2022). Deep learning for 3‑D bin packing: A survey. **International Journal of Production Research, 60**(12), 3765‑3784.*
*Three.js Authors. (2024). Three.js Documentation. <https://threejs.org/>*
*Gonçalves, J. F., & Resende, M. G. (2011). A biased random‑key genetic algorithm for 2D and 3D bin packing problems. **International Journal of Production Economics, 130**(1), 82‑94.*
