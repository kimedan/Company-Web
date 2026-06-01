
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Post, SiteConfig, Language, Certification, ContentMap, Product, ProcessStep, QualityEquipment } from '../types';
import { TRANSLATIONS } from '../translations';
import { db, doc, onSnapshot, setDoc, getDoc, initAppCheck } from '../utils/firebase';

interface SiteContextType {
  config: SiteConfig;
  posts: Post[];
  products: Product[]; 
  certifications: Certification[];
  processSteps: ProcessStep[];
  equipments: QualityEquipment[];
  content: ContentMap;
  language: Language;
  t: typeof TRANSLATIONS['KOR'];
  setLanguage: (lang: Language) => void;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  addPost: (post: Omit<Post, 'id' | 'views'> & { date?: string }) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, updates: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  updateContent: (key: string, value: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProcessStep: (id: string, updates: Partial<ProcessStep>) => void;
  resetProcessSteps: () => void;
  updateEquipment: (id: string, updates: Partial<QualityEquipment>) => void;
  resetEquipments: () => void;
  exportSiteData: () => void;
  importSiteData: (jsonData: string) => boolean;
  isSyncing: boolean;
}

const DEFAULT_CONFIG: SiteConfig = {
  siteName: '대우경금속',
  siteDescription: '차별화된 기술력과 서비스로 알루미늄 산업을 선도하겠습니다.',
  primaryColor: '#071D49',
  borderRadius: 'rounded-full', 
  seoKeywords: '알루미늄, 압출, 경량소재, 자동차부품',
  contactEmail: 'info@aldmc.co.kr'
};

const DEFAULT_POSTS: Post[] = [
  { id: '1', title: '2024년 신년사', author: '관리자', category: '공지사항', date: '2024-01-02', status: 'Published', views: 1250 },
  { id: '2', title: '창녕공장 신규 설비 도입 안내', author: '운영팀', category: '뉴스', date: '2024-02-15', status: 'Published', views: 890 },
  { id: '3', title: 'IATF 16949 인증 갱신 완료', author: '품질팀', category: '인증', date: '2024-03-10', status: 'Published', views: 540 },
  { id: '4', title: '하계 휴가 기간 공지', author: '인사팀', category: '공지사항', date: '2024-06-20', status: 'Draft', views: 0 },
];

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p1', slug: 'auto-parts', title: '자동차부품소재', category: 'Auto Parts', description: '자동차 경량화를 위한 고강도 알루미늄 소재', imageUrl: 'https://picsum.photos/id/20/600/400' },
  { id: 'p2', slug: 'industrial-material', title: '산업소재', category: 'Industrial', description: '다양한 산업 설비 및 기계 구조용 소재', imageUrl: 'https://picsum.photos/id/1/600/400' },
  { id: 'p3', slug: 'non-ferrous-material', title: '비철가공소재', category: 'Non-ferrous', description: '정밀 가공성이 우수한 고품질 소재', imageUrl: 'https://picsum.photos/id/192/600/400' },
  { id: 'p4', slug: 'electronics-material', title: '전기전자부품소재', category: 'Electronics', description: '전기 전도성과 방열성이 뛰어난 부품 소재', imageUrl: 'https://picsum.photos/id/3/600/400' },
  { id: 'p5', slug: 'construction-material', title: '건축소재', category: 'Construction', description: '내구성과 심미성을 갖춘 건축 내외장재', imageUrl: 'https://picsum.photos/id/10/600/400' },
  { id: 'p7', slug: 'general-material', title: '일반소재', category: 'General', description: '건물 및 제품의 외관을 돋보이게 하는 외장재', imageUrl: 'https://picsum.photos/id/12/600/400' },
];

const DEFAULT_CERTIFICATIONS: Certification[] = [
    { id: 'c1', title: "ISO 14001", imageUrl: "https://file.notion.so/f/f/c7dae5a5-48c6-4450-a729-3ac476c1b5bf/66d8c4ba-557d-4474-99e1-1fdcb5e3b341/%EC%9D%B8%EC%A6%9D%EC%84%9C_ISO_14001_KOR.jpg?table=block&id=2f7c2f22-549c-8023-8c3e-d83be4f40481&spaceId=c7dae5a5-48c6-4450-a729-3ac476c1b5bf&expirationTimestamp=1769731200000&signature=_GF85xHtmem9PFnqeJ4ijquTGWVOlLlwLXik6dkXWso&downloadName=%5B%EC%9D%B8%EC%A6%9D%EC%84%9C%5D+ISO+14001_KOR.jpg" },
    { id: 'c2', title: "ISO 9001", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer02_z.gif" },
    { id: 'c3', title: "벤처기업확인서", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer03_z.gif" },
    { id: 'c4', title: "KS 제품인증서", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer04_z.gif" },
    { id: 'c5', title: "기업부설연구소 인정서", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer05_z.gif" },
    { id: 'c6', title: "기술혁신형 중소기업", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer06_z.gif" },
    { id: 'c7', title: "IATF 16949", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer07_z.gif" },
    { id: 'c8', title: "상표등록증", imageUrl: "http://www.aldmc.co.kr/kor/images/about/cer/cer08_z.gif" },
];

const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  { id: 'ps1', title: '금형\n설계 및 제작', order: 1, imageUrl: 'https://images.unsplash.com/photo-1587843336338-95856eb28f09?auto=format&fit=crop&w=1920&q=80', description: '금형 설계 및 제작은 제품 형상과 치수 정밀도를 결정짓는 핵심 공정입니다. 오랜 경험의 전문 인력과 3D 가상 시뮬레이션 압출 해석을 통해 공정을 최적화하며, 고내구성 이온 질화 및 Multi-layer 등 차별화된 표면처리 기술로 압도적인 품질을 구현합니다.' },
  { id: 'ps2', title: '정밀\n압출', order: 2, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80', description: '예열된 빌렛을 수천 톤의 압력으로 금형을 통과시켜 원하는 형상으로 제조합니다. 0.02mm 수준의 초정밀 가공과 고난이도 외관재의 완벽한 압출을 위해 원자재 합금 배합비와 공정 조건을 체계적으로 데이터화하여 품질과 생산성을 극대화합니다.' },
  { id: 'ps3', title: '정밀\n인발', order: 3, imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1920&q=80', description: '인발 금형 공을 통하여 출구 쪽으로 당김으로써 정밀한 단면 수축을 얻는 공정입니다. 고도화된 정밀 인발 가공 기술을 적용하여 봉재, 파이프 등 다양한 제품의 완성도와 품질을 한 차원 더 높이고 있습니다.' },
  { id: 'ps4', title: '열처리\n(에이징)', order: 4, imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80', description: '제품의 잔류 응력을 제거하고 목적하는 기계적 물성을 완벽하게 확보하기 위해 압출 후 인공 시효 경화를 실시합니다. 최적화된 기계적 물성 향상을 목표로 설비를 지속적으로 개선하고 작업 조건을 데이터화하여 엄격하게 관리합니다.' },
  { id: 'ps5', title: '표면처리\n(피막)', order: 5, imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1920&q=80', description: '알루미늄 부식을 방지하기 위해 산화 피막과 무기염을 이용해 착색하는 아노다이징 공정입니다. 정밀한 약품 배합과 전기 제어로 피막 두께와 경도를 조절하며, 전문 기업과의 전략적 협업으로 신속하고 고품질의 피막 처리를 보장합니다.' },
  { id: 'ps6', title: '기계\n가공', order: 6, imageUrl: 'https://images.unsplash.com/photo-1611078516801-44670beebde3?auto=format&fit=crop&w=1920&q=80', description: '고객의 주문 사양에 맞추어 알루미늄 압출 형재를 절단, 절삭, 프레스 등 다양한 기계 가공을 거쳐 완성 부품으로 제조합니다. One-stop 제조 시스템을 통해 원가 절감은 물론 신속한 납기와 완벽한 품질 대응이 가능합니다.' },
  { id: 'ps7', title: '포장 및\n출하', order: 7, imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?auto=format&fit=crop&w=1920&q=80', description: '최종 품질 검사를 통과한 제품만을 선별하여 스크래치 방지를 위한 특수 포장재로 꼼꼼하게 포장합니다. 안전하고 신속한 물류 프로세스를 통해 최상의 품질 상태 그대로 고객에게 직배송 납품을 진행합니다.' }
];

const DEFAULT_EQUIPMENTS: QualityEquipment[] = [
  { id: 'qe1', name: '비디오메타(VMS)', spec: 'VMS', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80', description: '고해상도 카메라를 이용한 비접촉식 정밀 치수 측정 장비입니다.' },
  { id: 'qe2', name: '석정반', spec: '석정반', imageUrl: 'https://images.unsplash.com/photo-1616198642750-f8d2cc1f087e?auto=format&fit=crop&w=600&q=80', description: '제품 측정기나 부품 등을 놓기 위한 정밀하게 가공된 평면 작업대입니다.' },
  { id: 'qe3', name: '만능재료 시험기', spec: 'UTM', imageUrl: 'https://images.unsplash.com/photo-1574676104764-ae327c6f0ee4?auto=format&fit=crop&w=600&q=80', description: '완제품 및 시편의 인장, 압축, 굽힘 강도를 테스트합니다.' },
  { id: 'qe4', name: '로크웰 경도 시험기', spec: 'Rockwell', imageUrl: 'https://images.unsplash.com/photo-1612803856372-8805ffce1a64?auto=format&fit=crop&w=600&q=80', description: '소재 및 제품 표면의 체계적인 경도 측정을 수행합니다.' },
  { id: 'qe5', name: '실린더 게이지', spec: '실린더 게이지', imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?auto=format&fit=crop&w=600&q=80', description: '원통의 내경을 정밀하게 측정하는 장비입니다.' },
  { id: 'qe6', name: '성분분석기(FPI5000)', spec: 'FPI5000', imageUrl: 'https://images.unsplash.com/photo-1581092334245-d4fb30c5e7b2?auto=format&fit=crop&w=600&q=80', description: '제품의 합금 성분을 정밀하게 분석하여 소재의 적합성을 검증합니다.' }
];

const DEFAULT_CONTENT: ContentMap = {
  'home_hero_title_prefix': 'The Future of',
  'home_hero_title_highlight': 'Aluminum Extrusion',
  'home_hero_desc': '대우경금속은 차별화된 기술력과 서비스로 알루미늄 압출 산업을 선도합니다.\n고객 맞춤형 설계부터 완벽한 납기까지, 우리는 기준을 만듭니다.',
  'home_hero_badge': 'Aluminum Extrusion Total Solution',
  'intro_main_title_1': 'Global Leader',
  'intro_main_title_2': 'In Aluminum Extrusion',
  'intro_desc': '대우경금속은 고객 맞춤형 금형설계, 정밀압출, 도장/아노다이징(피막), 정밀절단, 기계가공 및 적기적소의 납기까지 알루미늄 압출을 중심으로 올인원 솔루션을 제공합니다.\n최첨단 설비와 축적된 기술력을 바탕으로 다양한 산업 분야의 핵심 소재를 공급하고 있습니다.',
  'daegu_biz_reg_pdf': '',
  'changnyeong_biz_reg_pdf': '',
  'news_desc': '대우의 변화와 성장을 투명하게,'
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '7 29 73';
};

// Firestore Collection Name
const COLLECTION_NAME = 'site_data';

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initially use DEFAULTs to avoid flicker, then hydrate from Firestore
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [posts, setPosts] = useState<Post[]>(DEFAULT_POSTS);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [certifications, setCertifications] = useState<Certification[]>(DEFAULT_CERTIFICATIONS);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(DEFAULT_PROCESS_STEPS);
  const [equipments, setEquipments] = useState<QualityEquipment[]>(DEFAULT_EQUIPMENTS);
  const [content, setContent] = useState<ContentMap>(DEFAULT_CONTENT);
  
  const [language, setLanguage] = useState<Language>('KOR');
  const [isSyncing, setIsSyncing] = useState(true);
  
  // Track data load status to prevent accidental overwrite
  const dataStatusRef = useRef<Record<string, 'loading' | 'success' | 'error' | 'not_found'>>({});

  // --- Firestore Realtime Sync ---
  useEffect(() => {
    const fetchWithSnapshot = (docName: string, setter: any, defaultData: any) => {
      dataStatusRef.current[docName] = 'loading';
      
      const unsubscribe = onSnapshot(doc(db, COLLECTION_NAME, docName), (snapshot) => {
        if (snapshot.exists()) {
          // If document exists in DB, use it
          let data = snapshot.data().data;
          
          if (!data || (Array.isArray(data) && data.length === 0)) {
            // Document exists but empty? We use fallback UI data
            // but DO NOT mark as success so that it won't overwrite empty array with defaults later unless intended
            data = defaultData;
            dataStatusRef.current[docName] = 'not_found';
          } else {
            dataStatusRef.current[docName] = 'success';
          }
          
          // Apply user requested overrides automatically if they are still using the old values
          if (docName === 'content') {
             if (data['home_hero_badge'] === 'Total Aluminum Solutions') data['home_hero_badge'] = 'Aluminum Extrusion Total Solution';
             if (data['home_hero_title_highlight'] === 'Aluminum Technology') data['home_hero_title_highlight'] = 'Aluminum Extrusion';
             if (
                data['home_hero_desc'] === '차별화된 기술력과 서비스로 알루미늄 산업을 선도합니다. 고객 맞춤형 설계부터 완벽한 납기까지, 우리는 기준을 만듭니다.' ||
                data['home_hero_desc'] === '대우경금속은 차별화된 기술력과 서비스로 알루미늄 압출 산업을 선도합니다. 고객 맞춤형 설계부터 완벽한 납기까지, 우리는 기준을 만듭니다.'
             ) {
                 data['home_hero_desc'] = '대우경금속은 차별화된 기술력과 서비스로 알루미늄 압출 산업을 선도합니다.\n고객 맞춤형 설계부터 완벽한 납기까지, 우리는 기준을 만듭니다.';
             }
             if (data['intro_main_title_1'] === 'Global Leader in') data['intro_main_title_1'] = 'Global Leader';
             if (data['intro_main_title_2'] === 'Aluminum Extrusion') data['intro_main_title_2'] = 'In Aluminum Extrusion';
             if (data['intro_desc'] === '대우경금속은 고객 맞춤형 설계, 생산, 피막, 기계가공 및 적기적소의 납기까지 Total 서비스를 제공합니다. 최첨단 설비와 축적된 기술력을 바탕으로 다양한 산업 분야의 핵심 소재를 공급하고 있습니다.' || data['intro_desc'] === '대우경금속은 고객 맞춤형 금형설계, 정밀압출, 도장/아노다이징(피막), 정밀절단, 기계가공 및 적기적소의 납기까지\n알루미늄 압출을 중심으로 올인원 솔루션을 제공합니다.\n최첨단 설비와 축적된 기술력을 바탕으로 다양한 산업 분야의 핵심 소재를 공급하고 있습니다.') {
                 data['intro_desc'] = '대우경금속은 고객 맞춤형 금형설계, 정밀압출, 도장/아노다이징(피막), 정밀절단, 기계가공 및 적기적소의 납기까지 알루미늄 압출을 중심으로 올인원 솔루션을 제공합니다.\n최첨단 설비와 축적된 기술력을 바탕으로 다양한 산업 분야의 핵심 소재를 공급하고 있습니다.';
             }
          }

          if (docName === 'products') {
            data = data.map((p: any) => {
              if (!p.slug) {
                if (p.id === 'p1') p.slug = 'auto-parts';
                else if (p.id === 'p2') p.slug = 'industrial-material';
                else if (p.id === 'p3') p.slug = 'non-ferrous-material';
                else if (p.id === 'p4') p.slug = 'electronics-material';
                else if (p.id === 'p5') p.slug = 'construction-material';
                else if (p.id === 'p7') p.slug = 'general-material';
                else p.slug = p.id;
              }
              return p;
            });
          }
          
          setter(data);
        } else {
          // If not exists (first run), we use hardcoded defaults for UI fallback.
          dataStatusRef.current[docName] = 'not_found';
          setter(defaultData);
        }
      }, (error) => {
        console.warn(`Firestore read blocked for ${docName}:`, error.message);
        dataStatusRef.current[docName] = 'error';
        // Fallback to default if there's an error
        setter(defaultData); 
      });

      return unsubscribe;
    };

    let active = true;
    const activeUnsubs: (() => void)[] = [];

    const initializeData = async () => {
      await initAppCheck(); // IMPORTANT: Wait for App Check before Firestore connections
      if (!active) return;
      
      const configUnsub = fetchWithSnapshot('config', setConfig, DEFAULT_CONFIG);
      const postsUnsub = fetchWithSnapshot('posts', setPosts, DEFAULT_POSTS);
      const productsUnsub = fetchWithSnapshot('products', setProducts, DEFAULT_PRODUCTS);
      const certsUnsub = fetchWithSnapshot('certifications', setCertifications, DEFAULT_CERTIFICATIONS);
      const processUnsub = fetchWithSnapshot('processSteps', setProcessSteps, DEFAULT_PROCESS_STEPS);
      const equipUnsub = fetchWithSnapshot('equipments', setEquipments, DEFAULT_EQUIPMENTS);
      const contentUnsub = fetchWithSnapshot('content', setContent, DEFAULT_CONTENT);

      if (!active) {
        configUnsub();
        postsUnsub();
        productsUnsub();
        certsUnsub();
        processUnsub();
        equipUnsub();
        contentUnsub();
        return;
      }

      activeUnsubs.push(configUnsub, postsUnsub, productsUnsub, certsUnsub, processUnsub, equipUnsub, contentUnsub);
      setIsSyncing(false);
    };

    initializeData();

    return () => {
      active = false;
      activeUnsubs.forEach(unsub => unsub());
    };
  }, []);

  // Update CSS Variables & Meta tags
  useEffect(() => {
    const rgb = hexToRgb(config.primaryColor);
    document.documentElement.style.setProperty('--brand-blue', rgb);
    document.title = `${config.siteName} | ${language === 'KOR' ? '알루미늄 전문기업' : 'Aluminum Specialist'}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', config.siteDescription);
  }, [config, language]);

  // --- Action Handlers (Write to Firestore) ---
  // When Admin changes something, we save to DB.
  
  const saveData = async (docName: string, data: any, forceInit: boolean = false) => {
    const status = dataStatusRef.current[docName];
    
    // 명시적 초기화(forceInit)가 아니면 success 상태에서만 저장 허용
    if (!forceInit && status !== 'success') {
      alert("Firestore 동기화 완료 전에는 저장할 수 없습니다.");
      return;
    }

    try {
      await setDoc(doc(db, COLLECTION_NAME, docName), { data });
      if (forceInit) {
        dataStatusRef.current[docName] = 'success';
      }
    } catch (error) {
      console.error(`Failed to save ${docName}:`, error);
      alert("변경사항 저장에 실패했습니다. (네트워크/권한 문제)");
    }
  };

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      saveData('config', updated);
      return updated;
    });
  };

  const addPost = (newPostData: Omit<Post, 'id' | 'views'> & { date?: string }) => {
    setPosts(prev => {
      const newPost: Post = {
        ...newPostData,
        id: Date.now().toString(),
        date: newPostData.date || new Date().toISOString().split('T')[0],
        views: 0,
      };
      const updated = [newPost, ...prev];
      saveData('posts', updated);
      return updated;
    });
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    setPosts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      saveData('posts', updated);
      return updated;
    });
  };

  const deletePost = (id: string) => {
    setPosts(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveData('posts', updated);
      return updated;
    });
  };

  const addCertification = (cert: Omit<Certification, 'id'>) => {
    setCertifications(prev => {
      const newCert = { ...cert, id: Date.now().toString() };
      const updated = [...prev, newCert];
      saveData('certifications', updated);
      return updated;
    });
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setCertifications(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      saveData('certifications', updated);
      return updated;
    });
  };

  const deleteCertification = (id: string) => {
    setCertifications(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveData('certifications', updated);
      return updated;
    });
  };

  const updateContent = (key: string, value: string) => {
    setContent(prev => {
      const updated = { ...prev, [key]: value };
      saveData('content', updated);
      return updated;
    });
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    setProducts(prev => {
      const newProduct: Product = {
        ...productData,
        id: `p_${Date.now()}`
      };
      const updated = [...prev, newProduct];
      saveData('products', updated);
      return updated;
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      saveData('products', updated);
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveData('products', updated);
      return updated;
    });
  };

  const updateProcessStep = (id: string, updates: Partial<ProcessStep>) => {
    setProcessSteps(prev => {
      const updated = prev.map(ps => ps.id === id ? { ...ps, ...updates } : ps);
      saveData('processSteps', updated);
      return updated;
    });
  };

  const resetProcessSteps = () => {
    setProcessSteps(prev => {
      saveData('processSteps', DEFAULT_PROCESS_STEPS);
      return DEFAULT_PROCESS_STEPS;
    });
  };

  const updateEquipment = (id: string, updates: Partial<QualityEquipment>) => {
    setEquipments(prev => {
      const updated = prev.map(eq => eq.id === id ? { ...eq, ...updates } : eq);
      saveData('equipments', updated);
      return updated;
    });
  };

  const resetEquipments = () => {
    setEquipments(prev => {
      saveData('equipments', DEFAULT_EQUIPMENTS);
      return DEFAULT_EQUIPMENTS;
    });
  };

  // --- Export/Import ---
  
  const exportSiteData = () => {
    const data = {
      config,
      posts,
      products,
      certifications,
      processSteps,
      equipments,
      content,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daewoo-site-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importSiteData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.config || !data.content) throw new Error("Invalid data format");

      saveData('config', data.config, true);
      saveData('posts', data.posts || [], true);
      saveData('products', data.products || [], true);
      saveData('certifications', data.certifications || [], true);
      saveData('processSteps', data.processSteps || [], true);
      saveData('equipments', data.equipments || [], true);
      saveData('content', data.content, true);

      return true;
    } catch (e) {
      console.error("Import failed:", e);
      return false;
    }
  };

  return (
    <SiteContext.Provider value={{ 
      config, 
      posts, 
      products,
      certifications,
      processSteps,
      equipments,
      content,
      language,
      t: TRANSLATIONS[language],
      setLanguage,
      updateConfig, 
      addPost, 
      updatePost,
      deletePost,
      addCertification,
      updateCertification,
      deleteCertification,
      updateContent,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProcessStep,
      resetProcessSteps,
      updateEquipment,
      resetEquipments,
      exportSiteData,
      importSiteData,
      isSyncing
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};
