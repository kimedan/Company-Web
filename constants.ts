
import { NavItem, Product } from './types';

export const NAV_ITEMS: NavItem[] = [
  {
    label: '회사소개',
    path: '/about/intro',
    subItems: [
      { label: '회사개요', path: '/about/intro' },
      { label: '회사연혁', path: '/about/history' },
      { label: '경영이념', path: '/about/philosophy' },
      { label: '인증현황', path: '/about/cert' }, 
      { label: '오시는 길', path: '/about/location' },
    ]
  },
  {
    label: '제품소개',
    path: '/products',
    subItems: [
      { label: '자동차부품소재', path: '/products/auto-parts' },
      { label: '산업소재', path: '/products/industrial-material' },
      { label: '비철가공소재', path: '/products/non-ferrous-material' },
      { label: '전기전자부품소재', path: '/products/electronics-material' },
      { label: '건축소재', path: '/products/construction-material' },
      { label: '일반소재', path: '/products/general-material' },
    ]
  },
  {
    label: '공정소개',
    path: '/process',
    subItems: [
      { label: '생산공정', path: '/process' },
      { label: '품질검사', path: '/quality' },
    ]
  },
  {
    label: '연구소',
    path: '/rnd',
  },
  {
    label: '회사소식',
    path: '/news',
  },
  {
    label: '고객지원',
    path: '/support',
  }
];

// DEPRECATED: PRODUCTS constant is no longer used directly. 
// Data is now managed via SiteContext for dynamic updates.
export const PRODUCTS: Product[] = [];

export const LEGAL_TEXTS = {
  EMAIL_COLLECTION_REFUSAL: `
    <h3 class="text-xl font-bold mb-4">이메일 무단수집 거부</h3>
    <p class="mb-4">본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 정보통신망법에 의해 형사처벌됨을 유념하시기 바랍니다.</p>
    <p class="mb-4">[게시일 2003년 9일 1일] 이메일을 기술적 장치를 사용하여 무단으로 수집, 판매·유통하거나 이를 이용한 자는 「정보통신망이용촉진 및 정보보호 등에 관한 법률」 제50조의2 규정에 의하여 1천만원 이하의 벌금형에 처해집니다.</p>
    <p class="mb-4">만일, 위와 같은 기술적 장치를 사용한 이메일주소 무단수집 피해를 당하신 경우 「불법스팸대응센터 전용전화(☎1336)나 홈페이지(www.spamcop.or.kr)의 신고창을 통하여 신고하여 주시기 바랍니다.</p>
    <div class="bg-gray-50 p-4 rounded-lg text-sm border border-gray-100">
      <strong class="block mb-2">정보통신망법 제50조의2 (전자우편주소의 무단 수집행위 등 금지)</strong>
      <ol class="list-decimal pl-4 space-y-1">
        <li>누구든지 전자우편주소의 수집을 거부하는 의사가 명시된 인터넷 홈페이지에서 자동으로 전자우편주소를 수집하는 프로그램 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하여서는 아니된다.</li>
        <li>누구든지 제1항의 규정을 위반하여 수집된 전자우편주소를 판매·유통 하여서는 아니된다.</li>
        <li>누구든지 제1항 및 제2항의 규정에 의하여 수집·판매 및 유통이 금지된 전자우편주소임을 알고 이를 정보전송에 이용하여서는 아니된다.</li>
      </ol>
    </div>
  `,
  PRIVACY_POLICY: `
    <h3 class="text-xl font-bold mb-4">개인정보 취급방침</h3>
    
    <p class="mb-4"><(주)대우경금속>('aldmc.co.kr'이하 '(주)대우경금속')은(는) 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.</p>
    
    <p class="mb-4"><(주)대우경금속>('(주)대우경금속') 은(는) 회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.</p>
    
    <p class="mb-6 font-medium">○ 본 방침은부터 2017년 7월 1일부터 시행됩니다.</p>

    <h4 class="font-bold mt-6 mb-2">1. 개인정보의 처리 목적</h4>
    <p class="mb-4"><(주)대우경금속>('aldmc.co.kr'이하 '(주)대우경금속')은(는) 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.<br/>가. 견적문의 등을 목적으로 개인정보를 처리합니다.</p>

    <h4 class="font-bold mt-6 mb-2">2. 개인정보 파일 현황</h4>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>개인정보 파일명 : (주)대우경금속 개인정보</li>
      <li>개인정보 항목 : 이메일, 휴대전화번호, 이름, 주소, 회사전화번호, 부서, 회사명, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
      <li>수집방법 : 홈페이지</li>
      <li>보유근거 : 개인정보보호법</li>
      <li>보유기간 : 3년</li>
      <li>관련법령 : 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</li>
    </ul>

    <h4 class="font-bold mt-6 mb-2">3. 개인정보의 처리 및 보유 기간</h4>
    <p class="mb-2">① <(주)대우경금속>('(주)대우경금속')은(는) 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의 받은 개인정보 보유,이용기간 내에서 개인정보를 처리,보유합니다.</p>
    <p class="mb-2">② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>견적문의: 견적문의와 관련한 개인정보는 수집.이용에 관한 동의일로부터 <3년>까지 위 이용목적을 위하여 보유.이용됩니다.</li>
      <li>보유근거 : 개인정보보호법</li>
      <li>관련법령 : 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</li>
    </ul>

    <h4 class="font-bold mt-6 mb-2">4. 개인정보의 제3자 제공에 관한 사항</h4>
    <p class="mb-2">① <(주)대우경금속>('aldmc.co.kr'이하 '(주)대우경금속')은(는) 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
    <p class="mb-2">② <(주)대우경금속>('aldmc.co.kr')은(는) 다음과 같이 개인정보를 제3자에게 제공하고 있습니다.</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>제공받는 자 : (주)대우경금속</li>
      <li>이용목적 : 이메일, 휴대전화번호, 이름, 주소, 회사전화번호, 부서, 회사명, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
      <li>보유.이용기간: 3년</li>
    </ul>

    <h4 class="font-bold mt-6 mb-2">5. 개인정보처리 위탁</h4>
    <p class="mb-2">① <(주)대우경금속>('(주)대우경금속')은(는) 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
    <p class="mb-2">② <(주)대우경금속>('aldmc.co.kr'이하 '(주)대우경금속')은(는) 위탁계약 체결시 개인정보 보호법 제25조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적․관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
    <p class="mb-4">③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.</p>

    <h4 class="font-bold mt-6 mb-2">6. 정보주체와 법정대리인의 권리·의무 및 그 행사방법</h4>
    <p class="mb-2">이용자는 개인정보주체로써 다음과 같은 권리를 행사할 수 있습니다.</p>
    <ol class="list-decimal pl-5 mb-4 space-y-1">
      <li>정보주체는 (주)대우경금속에 대해 언제든지 개인정보 열람,정정,삭제,처리정지 요구 등의 권리를 행사할 수 있습니다.</li>
      <li>권리 행사는 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 지체 없이 조치하겠습니다.</li>
      <li>권리 행사는 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다.</li>
      <li>개인정보 열람 및 처리정지 요구는 관련 법령에 의하여 제한될 수 있습니다.</li>
      <li>개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</li>
    </ol>

    <h4 class="font-bold mt-6 mb-2">7. 처리하는 개인정보의 항목</h4>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>필수항목 : 이메일, 휴대전화번호, 이름, 주소, 서비스 이용 기록, 접속 로그, 접속 IP 정보</li>
      <li>선택항목 : 회사전화번호, 부서, 회사명, 쿠키</li>
    </ul>

    <h4 class="font-bold mt-6 mb-2">8. 개인정보의 파기</h4>
    <p class="mb-2"><(주)대우경금속>('(주)대우경금속')은(는) 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다.</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>파기절차: 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</li>
      <li>파기기한: 개인정보의 보유기간이 경과된 경우 종료일로부터 5일 이내, 처리 목적 달성 등 불필요하게 되었을 때에는 5일 이내에 파기합니다.</li>
      <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
    </ul>

    <h4 class="font-bold mt-6 mb-2">9. 개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항</h4>
    <p class="mb-2">① (주)대우경금속 은 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다.</p>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>쿠키의 사용 목적 : 이용자에게 최적화된 정보 제공을 위해 사용됩니다.</li>
      <li>쿠키의 설치•운영 및 거부 : 웹브라우저 옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다.</li>
      <li>쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</li>
    </ul>

    <h4 class="font-bold mt-6 mb-2">10. 개인정보 보호책임자</h4>
    <div class="bg-gray-50 p-4 rounded-lg text-sm border border-gray-100 mb-4">
      <p>성명 : 오정현</p>
      <p>직책 : 주임</p>
      <p>연락처 : 055-533-0013, zzocojoa@aldmc.co.kr</p>
    </div>

    <h4 class="font-bold mt-6 mb-2">11. 개인정보 처리방침 변경</h4>
    <p class="mb-4">이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>

    <h4 class="font-bold mt-6 mb-2">12. 개인정보의 안전성 확보 조치</h4>
    <ul class="list-disc pl-5 mb-4 space-y-1">
      <li>개인정보 취급 직원의 최소화 및 교육</li>
      <li>개인정보의 암호화</li>
    </ul>

    <h4 class="font-bold mt-6 mb-2">13. 개인정보 열람청구</h4>
    <p class="mb-2">정보주체는 개인정보 보호법 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다.</p>
    <div class="bg-gray-50 p-4 rounded-lg text-sm border border-gray-100">
      <strong>개인정보 열람청구 접수·처리 부서</strong>
      <p>담당자 : 오정현</p>
      <p>연락처 : 055-533-0013, zzocojoa@aldmc.co.kr</p>
    </div>
  `
};
