<template>
  <header>
    <HeaderTop />
  </header>

  <main>
    <div class="ButtonType">
      <TitleButton @click="showSearch" />
      <MapButton @click="showCity" />
      <LikeButton @click="showLike" />
    </div>
    <div class="SearchButton">
      <SearchButton v-if="currentComponent === 'search'" @search="handleSearch" />
      <CityButton v-if="currentComponent === 'city'" :optionsCity="sidoList" @searchResults="handleSearchResults" />
      <NextButton class="nextButton" @click="goToPlanDetail" />
    </div>
  </main>


  <div class="plan-map">
    <div class="plan" v-if="showPlan">
      <div v-for="(item, index) in searchResult" :key="index" class="place-card" @click="() => toggleSelect(item)">
        <div class="place-info">
          <!-- <img :src="item.img && item.img.trim() !== null ? item.img : '/img/ssafylogo.jpg'" alt="장소 이미지" class="place-image" /> -->
          <img :src="resolveImage(item.img)" alt="장소 이미지" class="place-image" />

          <div class="">
            <div class="tag">{{ item.name }}</div>
            <div class="title">{{ item.address }}</div>
          </div>
        </div>
        <div class="place-top">
          <!-- <div class="place-number">{{ index + 1 }}</div> -->
          <img class="bookmarkImg" :src="bookmarkedList.includes(item.ano) ? '/RedHeart.png' : '/WhiteHeart.png'"
            @click.stop="() => toggleBookmark(item)" alt="좋아요 저장" />
        </div>
      </div>
    </div>

    <div class="map-wrapper">
      <div class="category-bar">
        <button v-for="item in categories" :key="item.code" @click="searchCategory(item.code)">
          <img :src="item.icon" :alt="item.name" />
          <span>{{ item.name }}</span>
        </button>
      </div>
      <div class="map" id="Map" ref="mapContainer"></div>
    </div>
  </div>

</template>

<script setup>
import HeaderTop from './components/Fragments/HeaderTop.vue'
import TitleButton from '@/TitleButton.vue'
import MapButton from '@/MapButton.vue'
import LikeButton from '@/LikeButton.vue'
import SearchButton from '@/SearchButton.vue'
import CityButton from '@/CityButton.vue'
import NextButton from '@/NextButtonPlan.vue'

import { ref, useTemplateRef, onMounted, watch } from 'vue'
import { api } from '@/axios'
import { useMemberStore } from '@/store/member'
import { useRouter } from 'vue-router'
import { usePlanStore } from '@/store/usePlanStore'


const showPlan = ref(false)
const defaultImage = '/ssafylogo.jpg'
let map = null
const selectedSido = ref('')
const selectedSigungu = ref('')
const sidoList = ref([])
const sigunguList = ref([])
const selectedPlace = ref(null)
const currentComponent = ref('search')
const store = useMemberStore();
const router = useRouter()
let placeService = null;
let categoryMarkers = [];
const selectedCategory = ref(null)
const bookmarkedList = ref([]);

let infoWindow = null;

const showLike = async () => {
  currentComponent.value = 'search'
  if (!store.loginUser?.mno) {
    alert('로그인이 필요합니다.')
    return
  }
  try {
    const res = await api.get(`/api/hotplaces/likes/${store.loginUser.mno}`)
    // 만약 res.data가 없다면. 
    if (Array.isArray(res.data)) {
      searchResult.value = res.data;
      showPlan.value = true;
    }
    else {
      searchResult.value = [];
    }

    searchResult.value = Array.isArray(res.data) ? res.data : []


    //console.log('Like 출력 : ', searchResult.value)
  } catch (e) {
    console.log(e)
    alert('지역 목록을 불러오지 못했습니다.')
  }
}

const showSearch = () => {
  currentComponent.value = 'search'
}




const showCity = async () => {
  currentComponent.value = 'city'
  if (sidoList.value.length === 0) {
    try {
      const res = await api.get('/api/attractions')
      sidoList.value = res.data

      //console.log('sidoList 선택 : ', sidoList.value)
    } catch (e) {
      console.log(e)
      alert('지역 목록을 불러오지 못했습니다.')
    }
  }
}

const contentTypes = [
  '관광지',
  '문화시설',
  '축제공연행사',
  '여행코스',
  '레포츠',
  '숙박',
  '쇼핑',
  '음식점',
]

//const mapContainer = useTemplateRef('map')
const mapContainer = ref(null)

onMounted(async () => {
  if (window.kakao && mapContainer.value) {
    map = new window.kakao.maps.Map(mapContainer.value, mapOption)
    placeService = new window.kakao.maps.services.Places();
    if (store.loginUser?.mno) {
      const res = await api.get(`/api/hotplaces/likesList/${store.loginUser.mno}`);
      bookmarkedList.value = res.data;  // [ano, ...] or [name, ...]
    }
  }
})

const mapOption = {
  center: new kakao.maps.LatLng(36.3, 127.8), // 대한민국 중심 좌표
  //center: new kakao.maps.LatLng(37.517236, 127.047325), // 대한민국 중심 좌표
  //level : 6
  level: 12

}

// onMounted(() => {
//   map = new window.kakao.maps.Map(mapContainer.value, mapOption)
// })

const onSidoChange = async () => {
  selectedSigungu.value = ''
  sigunguList.value = []
  if (!selectedSido.value) return
  const res = await api.get(`/api/attractions/regions?sido=${selectedSido.value}`)
  sigunguList.value = res.data
}

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
const searchResult = ref([])
const selected = ref({ city: '', gun: '', type: '' })

const handleSearchResults = ({ list, city, gun, type }) => {
  searchResult.value = list
  selected.value.city = city
  selected.value.gun = gun
  selected.value.type = type

  //console.log('Attraction에서 받은 list : ', searchResult)
  //console.log('Attaraciton에서 받은 시군구 : ', selected)


  //console.log('list 첫 객체 : ', list[0].lat, list[0].lon)


  if (map && typeof map.setCenter === 'function' && list.length > 0) {
    showPlan.value = true
    const lat = parseFloat(list[0].lat)
    const lng = parseFloat(list[0].lon)
    const bounds = new kakao.maps.LatLngBounds();
    const moveLatLon = new kakao.maps.LatLng(lat, lng)
    map.setCenter(moveLatLon)
    map.setLevel(6)
  } else {
    console.warn('지도 객체가 아직 준비되지 않았거나 장소 리스트가 비어 있습니다.')
  }
}



const markerPath = '/markerIcon.png'

const markerMap = ref(new Map())
const selectedItems = ref([])        // 선택된 카드(장소) 목록
let polyline = null                 // Polyline 객체


const toggleSelect = (item) => {
  const key = item.name // 또는 고유 id가 있다면 그게 더 좋음

  const idx = selectedItems.value.findIndex(i => i.name === key);
  if (idx > -1) {
    const marker = markerMap.value.get(key);
    if (marker) {
      marker.setMap(null);
      markerMap.value.delete(key);
    }
    selectedItems.value.splice(idx, 1);

    updatePolyline();
    return;
  }

  const position = new window.kakao.maps.LatLng(item.lat, item.lon)
  const markerImage = new window.kakao.maps.MarkerImage(
    markerPath,
    new window.kakao.maps.Size(35, 35)
  )
  const marker = new window.kakao.maps.Marker({
    map: map,
    position: position,
    title: item.name,
    image: markerImage
  });

  // 마커 클릭 시 마커 및 폴리라인 삭제
  window.kakao.maps.event.addListener(marker, 'click', () => {
    marker.setMap(null);
    markerMap.value.delete(key);
    const idx2 = selectedItems.value.findIndex(i => i.name === key);
    if (idx2 > -1) {
      selectedItems.value.splice(idx2, 1);
    }
    updatePolyline();
  });

  markerMap.value.set(key, marker);
  selectedItems.value.push(item);
  updatePolyline();
  fitMapToMarkers();
}

function updatePolyline() {
  // 기존 Polyline 삭제
  if (polyline) {
    polyline.setMap(null);
    polyline = null;
  }
  if (selectedItems.value.length < 2) return;

  // 선택된 순서대로 경로 연결
  const path = selectedItems.value.map(item =>
    new window.kakao.maps.LatLng(item.lat, item.lon)
  );
  polyline = new window.kakao.maps.Polyline({
    path: path,
    strokeWeight: 4,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeStyle: 'solid'
  });
  polyline.setMap(map);
}


function fitMapToMarkers() {
  const bounds = new kakao.maps.LatLngBounds();
  markerMap.value.forEach(marker => {
    bounds.extend(marker.getPosition());
  });
  if (markerMap.value.size > 0) {
    map.setBounds(bounds);
    setTimeout(() => {
      if (map.getLevel() < 5) {
        map.setLevel(5);
      }
    }, 0);
  }
}


const resolveImage = (img) => {
  return img && img.trim() !== '' ? img : defaultImage
}



async function toggleBookmark(item) {
  const ano = item.ano;
  const mno = store.loginUser.mno;
  try {
    // 서버에 요청
    const response = await api.post('/api/hotplaces/likes', { uid: mno, ano });

    if (bookmarkedList.value.includes(ano)) {
      // 1. 좋아요 해제: 배열에서 삭제
      bookmarkedList.value = bookmarkedList.value.filter(a => a !== ano);

      // 2. [추가] 좋아요 화면(=searchResult)에서 해당 카드 삭제
      // 현재 '좋아요' 리스트를 보여주는 경우만 동작
      if (currentComponent.value === 'search' && searchResult.value.length > 0) {
        // 현재 리스트에 이 ano가 있다면 삭제
        searchResult.value = searchResult.value.filter(place => place.ano !== ano);
      }
    } else {
      // 좋아요 추가
      bookmarkedList.value = [...bookmarkedList.value, ano];
    }
    // (선택) 좋아요 개수 최신화
    item.likes = response.data.updatedLikes;
  } catch (e) {
    alert('좋아요 처리 실패');
    console.error(e);
  }
}


// 중심 좌표
const centerLatLng = ref({ lat: null, lng: null })
let centerMarker = null

watch(markerMap, () => {

  if (!map) return;
  //중심 마커 관리
  // if (centerMarker) {
  //   centerMarker.setMap(null)
  //   centerMarker = null
  // }

  const positions = []
  markerMap.value.forEach(marker => {
    const pos = marker.getPosition()
    positions.push({ lat: pos.getLat(), lng: pos.getLng() })
  })
  if (positions.length === 0) {
    centerLatLng.value = { lat: null, lng: null }
    return
  }

  // 중심 좌표 계산
  const centerLat = positions.reduce((sum, p) => sum + p.lat, 0) / positions.length
  const centerLng = positions.reduce((sum, p) => sum + p.lng, 0) / positions.length

  // 중심 마커 지도에 표시
  // centerMarker = new window.kakao.maps.Marker({
  //   position: new window.kakao.maps.LatLng(centerLat, centerLng),
  //   map: map,
  //   title: '중심'
  // })

  // 중심 좌표 ref 변수에 저장
  centerLatLng.value = { lat: centerLat, lng: centerLng }
}, { deep: true })



async function handleSearch(keyword) {
  currentComponent.value = 'search'

  if (!store.loginUser?.mno) {
    alert('로그인이 필요합니다.')
    return
  }

  try {
    const res = await api.get(`/api/attractions/search/title/${keyword}`)

    if (Array.isArray(res.data)) {

      const { lat, lng } = centerLatLng.value
      if (lat != null && lng != null) {
        searchResult.value = [...res.data].sort((a, b) => {
          const distA = getDistance(lat, lng, parseFloat(a.lat), parseFloat(a.lon))
          const distB = getDistance(lat, lng, parseFloat(b.lat), parseFloat(b.lon))
          return distA - distB
        })
      } else {
        searchResult.value = res.data
      }
      showPlan.value = true
    } else {
      searchResult.value = []
    }
    //console.log('Like 출력 : ', searchResult.value)
  } catch (e) {
    console.log(e)
    alert('지역 목록을 불러오지 못했습니다.')
  }
}

function getDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const planStore = usePlanStore()

const goToPlanDetail = () => {
  // store에 selectedItems 저장
  planStore.setSelectedItems(selectedItems.value)
  router.push('/PlanDetail')
}

const categories = [
  { code: 'CS2', name: '편의점', icon: '/src/assets/img/convenience-store.png' },
  { code: 'PK6', name: '주차장', icon: '/src/assets/img/parking.png' },
  { code: 'OL7', name: '주유소', icon: '/src/assets/img/gasstation.png' },
  { code: 'SW8', name: '지하철역', icon: '/src/assets/img/train.png' },
  { code: 'CE7', name: '카페', icon: '/src/assets/img/coffee.png' },
  { code: 'PM9', name: '약국', icon: '/src/assets/img/medicine.png' },
  { code: 'BK9', name: '은행', icon: '/src/assets/img/bank.png' }
]



function searchCategory(categoryCode) {

  // 이미 선택된 카테고리를 다시 클릭했으면 마커만 지우고 종료
  if (selectedCategory.value === categoryCode) {
    clearCategoryMarkers();
    selectedCategory.value = null; // 선택 해제
    return;
  }

  selectedCategory.value = categoryCode; // 현재 선택한 카테고리 저장

  if (!placeService || !map) return;

  clearCategoryMarkers();

  // 중심좌표(또는 현재 지도 범위에서 검색)
  const center = map.getCenter();

  // 카테고리 검색 요청
  placeService.categorySearch(
    categoryCode,
    (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // data: 검색된 장소 배열
        data.forEach(place => {
          // 마커 생성
          const marker = new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
            title: place.place_name,
            // 필요하다면 마커이미지도 커스텀 가능
          });
          categoryMarkers.push(marker);
          window.kakao.maps.event.addListener(marker, 'click', () => {
            if (infoWindow) infoWindow.close();
            const content = `
  <div style="
    border-radius: 16px;
    background: #f5f9ff;
    box-shadow: 0 6px 24px rgba(99,151,255,0.13), 0 1.5px 6px rgba(60,60,60,0.08);
    padding: 18px 22px 16px 22px;
    min-width: 230px;
    max-width: 330px;
    font-family: 'Pretendard', 'Inter', '맑은 고딕', sans-serif;
    border: 1.5px solid #A3C3FF; /* 연한 파랑 */
    position: relative;
  ">
    <div style="font-weight:700; color:#4D77FF; font-size:18px; margin-bottom:9px; letter-spacing:-1px;">
      ${place.place_name}
    </div>
    <div style="color:#2B395A; font-size:15px; margin-bottom:11px;">
      ${place.road_address_name || place.address_name}
    </div>
    <button style="
      background: #6397FF;
      color:#fff;
      font-size:15px;
      border:none;
      border-radius:9px;
      padding:10px 38px;
      margin:10px auto 0 auto;
      cursor:pointer;
      display:block;
      font-weight:600;
      box-shadow:0 2px 8px #A3C3FF88;
      transition:background 0.17s;
    " onclick="window.open('https://map.kakao.com/link/to/${encodeURIComponent(
              place.place_name
            )},${place.y},${place.x}','_blank')">
      길찾기
    </button>
  </div>
`

            infoWindow = new window.kakao.maps.InfoWindow({
              content,
              removable: true
            });
            infoWindow.open(map, marker);
          });
        });


      } else {
        alert('검색 결과가 없습니다.');
      }
    },
    { location: center, radius: 5000 } // 반경 5km (필요시 조정)
  );
}

function clearCategoryMarkers() {
  categoryMarkers.forEach(marker => marker.setMap(null));
  categoryMarkers = [];
}

</script>

<style scoped>
.ButtonType {
  display: flex;
  width: 450px;
  gap: 20px;
  padding-top: 20px;
  padding-left: 30px;
  padding-right: 25px;
}

.nextButton {
  margin-left: auto;
  margin-right: 35px;
}

.SearchButton {
  padding-left: 30px;
  padding-top: 20px;
  height: 50px;
  display: flex;
}

.plan-map {
  display: flex;
  gap: 40px;
  padding-left: 20px;
  padding-top: 20px;
}

.plan {
  /* background-color: #c8c8c8; */
  width: 450px;
  height: 1000px;
  border-radius: 8px;
  overflow-y: auto;

}


.place-card:active {
  /* transform: scale(0.96); ✨ 눌리는 듯한 효과 */
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.9);
  /* 살짝 그림자 축소 */
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 1000px;

}

.map {
  background-color: gray;
  width: 100%;
  /*1970px*/
  height: 1000px;
}

.place-card {
  background-color: white;
  margin: 12px;
  padding: 10px 5px 10px 10px;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.7);
  position: relative;
  display: flex;
}

.place-card.pressed {
  transform: scale(0.96);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease;
}


.place-top {
  position: absolute;
  bottom: 25%;
  right: 30px;
}

.place-number {
  width: 20px;
  align-items: center;
  text-align: center;
  font-size: 20px;
  color: #444;
}

.bookmark {
  width: 20px;
  height: 20px;
  padding-top: 2px;
  position: absolute;
  top: 10px;
  right: 8px;
}

.bookmarkImg {
  width: 20px;
  height: 20px;
  padding-top: 2px;
  position: absolute;
}

/* .bookmarkImg:active {
  background-color: black;
} */

.place-image {
  width: 100px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 12px;
}

.place-info {
  /* flex: 1;
  display: block;
  flex-direction: column;
  gap: 10px; */
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 6px;
  width: 100%;
}

.tag {
  color: black;
  padding: 6px 0px 6px 0px;
  font-size: 15px;
  width: fit-content;
  font-weight: bold;
}

.title {
  margin: 0;
  font-size: 11px;
  color: #222;
  padding-top: 6px;
}

.bookmark {
  font-size: 20px;
  margin-left: 8px;
  cursor: pointer;
}

.category-bar {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 8px 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
  /* 지도보다 위에 나오게 */
}

.category-bar button {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 8px;
}

.category-bar img {
  width: 28px;
  height: 28px;
  margin-bottom: 2px;
}
</style>
