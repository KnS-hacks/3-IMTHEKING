navigator.geolocation.getCurrentPosition(function(position){
  var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
  mapOption = { 
      center: new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude), // 지도의 중심좌표
      level: 2 // 지도의 확대 레벨
  };

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

var marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
    infowindow = new kakao.maps.InfoWindow({zindex:1}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

const addressContainer = document.querySelector("#address");
const latitudeContainer = document.querySelector("#lat");
const longitudeContainer = document.querySelector("#lon");

// 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            var detailAddr = !!result[0].road_address;
            detailAddr =result[0].address.address_name;
            
            var content = detailAddr
            
            var latlng = mouseEvent.latLng;
            // 마커를 클릭한 위치에 표시합니다 
            marker.setPosition(mouseEvent.latLng);
            marker.setMap(map);
            
            // 번지수를 제외한 주소 추출
            extractCity(content);

            addressContainer.value = stringAddress;
            latitudeContainer.value = mouseEvent.latLng.Ma;
            longitudeContainer.value = mouseEvent.latLng.La;
            // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
            infowindow.setContent(content);
            infowindow.open(map, marker);
        }   
    });
});

// 번지수를 제외한 주소 추출 메서드
function extractCity(content){
    // 띄어 주소 쓰기로 분리
    lastAddress = content.split(" ");
    // 마지막 세부 주소 삭제
    lastAddress.pop();
        //  배열 to 문자열
    stringAddress = lastAddress.join(" ");
}

// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'idle', function() {
    searchAddrFromCoords(map.getCenter());
});

function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
}

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}
})