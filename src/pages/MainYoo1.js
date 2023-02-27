import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AImode from "../components/AImode";
import React, { useEffect } from "react";
import PortalPopup from "../components/PortalPopup";
import Del from "../components/Del";
import Add from "../components/Add";
import "./MainYoo1.css";
import "./Map_basic.css";
import axios from "axios";

const MainYoo1 = () => {
  const navigate = useNavigate();
  const [isAImodeOpen, setAImodeOpen] = useState(false);
  const [isDelOpen, setDelOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [data, setData] = useState([]);

  const [problem, setProblem] = useState([
    {
      error_name: " ",
      error_date: " ",
    },
  ]);
  // 사진 뽑을거에요
  let bytes, blob;

  // 맵관련useState
  const [info, setInfo] = useState([]);
  const [map, setMap] = useState("");
  const cnt = [];
  let positions = [];
  let marker;

  // 거리구하기
  // 관할서
  const [off, setOff] = useState([]);
  // 관할서 이름
  const [offName, setOffName] = useState("");
  const [offlocation, setOfflocation] = useState("");
  // const custom = [];
  // var CustomOverlay;

  // const [test, setTest] = useState();

  const onMenuIconClick = useCallback(() => {
    navigate("/frame-39971");
  }, [navigate]);

  const onLogoutContainerClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onMorePoliceContainerClick = useCallback(() => {
    navigate("/police");
  }, [navigate]);

  const ongrafContainerClick = useCallback(() => {
    navigate("/graf");
  }, [navigate]);

  const onMoreErrorContainerClick = useCallback(() => {
    navigate("/error");
  }, [navigate]);

  const onMainContainerClick = useCallback(() => {
    navigate("/main-yoo1");
  }, [navigate]);

  const openAImode = useCallback(() => {
    setAImodeOpen(true);
  }, []);

  const closeAImode = useCallback(() => {
    setAImodeOpen(false);
  }, []);

  const openDel = useCallback(() => {
    setDelOpen(true);
  }, []);

  const closeDel = useCallback(() => {
    setDelOpen(false);
  }, []);

  const openAdd = useCallback(() => {
    setAddOpen(true);
  }, []);

  const closeAdd = useCallback(() => {
    setAddOpen(false);
  }, []);

  useEffect(() => {
    axios
      .post("http://127.0.0.1:3001/main")
      .then((res) => {
        console.log("info데이터 가져와짐", res.data.tl_info);
        setInfo(res.data.tl_info);
        setOff(res.data.res1); // office관할서
        console.log("관할서 정보 가져오기 : ", res.data.res1);
      })
      .catch(() => {
        console.log("데이터 보내기 실패");
      });
    let mapContainer = document.getElementById("map"), // 지도의 중심좌표
      mapOption = {
        center: new kakao.maps.LatLng(34.99449263426358, 126.82119646675224), // 지도의 중심좌표
        level: 8, // 지도의 확대 레벨
      };
    setMap(new kakao.maps.Map(mapContainer, mapOption)); // 지도를 생성합니다
    // 마커를 클릭했을 때 나타나는 이벤트함수입니다.
  }, []);

  // 마커 찍는 함수입니다. (필요)
  for (let i = 0; i < info.length; i++) {
    console.log("tl_pic : ", info[i].tl_pic.data);
    bytes = new Uint8Array(info[i].tl_pic.data);
    blob = new Blob([bytes], { type: "image/bmp" });
    console.log("여기 사진 상태는 뭐니 : ", URL.createObjectURL(blob));
    positions.push({
      title: info[i].tl_name, //신호등 번호(정보)
      address: info[i].tl_location, // 신호등 대략적인 위치
      state: info[i].tl_ai, // ai모드 상태 여부
      pimg: URL.createObjectURL(blob), // 사진 출력
      latlng: new kakao.maps.LatLng(
        Number(info[i].tl_lat),
        Number(info[i].tl_long)
      ), //위도,경도
    });
    if (positions[i].state == "1") {
      displayMarker(i);
    } else {
      displayMarker2(i);
    }
  }

  // 지도에 마커를 표시하는 함수입니다(AI mode off)
  function displayMarker2(i) {
    var imageSrc = "img/tl2.png", // 마커이미지의 주소입니다
      imageSize = new kakao.maps.Size(45, 70), // 마커이미지의 크기입니다
      imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
    // 마커의 이미지를 생성합니다.
    var markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );
    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    marker = new kakao.maps.Marker({
      // 마커가 표시될 지도
      map: map,
      // 마커가 표시될 위치
      position: positions[i].latlng,
      // 마커의 이미지
      image: markerImage,
    });
    // close.push(marker);

    // 커스텀오버레이 생성
    var CustomOverlay = new kakao.maps.CustomOverlay({
      yAnchor: 1.45,
      position: marker.getPosition(),
    });
    // custom.push(CustomOverlay);
    // console.log("커스텀길이 : ", custom.length);

    var Customcontent = document.createElement("div");
    Customcontent.className = "wrap";

    var info = document.createElement("div");
    info.className = "info";
    Customcontent.appendChild(info);

    //타이틀
    var contentTitle = document.createElement("div");
    contentTitle.className = "title";
    contentTitle.appendChild(document.createTextNode(positions[i].title));
    info.appendChild(contentTitle);
    // function test() {
    //   CustomOverlay.setMap(null);
    // }
    //닫기 버튼
    var closeBtn = document.createElement("div");
    closeBtn.className = "close";
    closeBtn.setAttribute("title", "닫기");
    closeBtn.onclick = function () {
      CustomOverlay.setMap(null);
    };

    // function closeCustom() {
    //   for (let i = 0; i < custom.length; i++) {
    //     CustomOverlay.setMap(null);
    //   }
    // }
    //    closeBtn.onclick = test();
    contentTitle.appendChild(closeBtn);

    var bodyContent = document.createElement("div");
    bodyContent.className = "body";
    info.appendChild(bodyContent);

    var imgDiv = document.createElement("div");
    imgDiv.className = "img";
    bodyContent.appendChild(imgDiv);

    //이미지
    var imgContent = document.createElement("img");
    imgContent.src = positions[i].pimg;
    imgContent.setAttribute("src", positions[i].pimg);

    imgContent.setAttribute("width", "73px");
    imgContent.setAttribute("heigth", "100px");
    imgDiv.appendChild(imgContent);

    var descContent = document.createElement("div");
    descContent.className = "desc";
    bodyContent.appendChild(descContent);

    CustomOverlay.setContent(Customcontent);

    kakao.maps.event.addListener(marker, "click", function () {
      setData(positions[i]);
      sessionStorage.setItem("name", positions[i].title);
      let title = positions[i].title;
      axios
        .post("http://127.0.0.1:3001/problem", {
          title: title,
        })
        .then((res) => {
          console.log("이상내역 데이터 가져와짐", res.data.problem);
          console.log("이상내역 데이터 길이 : ", res.data.problem.length);
          if (res.data.problem.length > 0) {
            setProblem(res.data.problem);
          } else {
            setProblem([
              {
                error_name: " ",
                error_date: " ",
              },
            ]);
          }
        })
        .catch(() => {
          console.log("데이터 보내기 실패");
        });
      NavigationInfo2(positions[i].latlng, off);
      CustomOverlay.setMap(map);
    });
  }

  // 지도에 마커를 표시하는 함수입니다(AI mode on)
  function displayMarker(i) {
    var imageSrc = "img/tl.png", // 마커이미지의 주소입니다
      imageSize = new kakao.maps.Size(60, 70), // 마커이미지의 크기입니다
      imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
    // 마커의 이미지를 생성합니다.
    var markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );
    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    marker = new kakao.maps.Marker({
      // 마커가 표시될 지도
      map: map,
      // 마커가 표시될 위치
      position: positions[i].latlng,
      // 마커의 이미지
      image: markerImage,
    });

    //커스텀오버레이 생성
    var CustomOverlay = new kakao.maps.CustomOverlay({
      yAnchor: 1.45,
      position: marker.getPosition(),
    });

    var Customcontent = document.createElement("div");
    Customcontent.className = "wrap";

    var info = document.createElement("div");
    info.className = "info";
    Customcontent.appendChild(info);

    //타이틀
    var contentTitle = document.createElement("div");
    contentTitle.className = "title";
    contentTitle.appendChild(document.createTextNode(positions[i].title));
    info.appendChild(contentTitle);
    //닫기 버튼
    var closeBtn = document.createElement("div");
    closeBtn.className = "close";
    closeBtn.setAttribute("title", "닫기");
    closeBtn.onclick = function () {
      CustomOverlay.setMap(null);
    };

    contentTitle.appendChild(closeBtn);

    var bodyContent = document.createElement("div");
    bodyContent.className = "body";
    info.appendChild(bodyContent);

    var imgDiv = document.createElement("div");
    imgDiv.className = "img";
    bodyContent.appendChild(imgDiv);

    //이미지
    var imgContent = document.createElement("img");
    imgContent.src = positions[i].pimg;
    imgContent.setAttribute("src", positions[i].pimg);

    imgContent.setAttribute("width", "73px");
    imgContent.setAttribute("heigth", "100px");
    imgDiv.appendChild(imgContent);

    var descContent = document.createElement("div");
    descContent.className = "desc";
    bodyContent.appendChild(descContent);

    CustomOverlay.setContent(Customcontent);

    kakao.maps.event.addListener(marker, "click", function () {
      setData(positions[i]);
      sessionStorage.setItem("name", positions[i].title);
      let title = positions[i].title;
      axios
        .post("http://127.0.0.1:3001/problem", {
          title: title,
        })
        .then((res) => {
          console.log("이상내역 데이터 가져와짐", res.data.problem);
          console.log("이상내역 데이터 길이 : ", res.data.problem.length);
          if (res.data.problem.length > 0) {
            setProblem(res.data.problem);
          } else {
            setProblem([
              {
                error_name: " ",
                error_date: " ",
              },
            ]);
          }
        })
        .catch(() => {
          console.log("데이터 보내기 실패");
        });
      NavigationInfo2(positions[i].latlng, off);
      CustomOverlay.setMap(map);
    });
  }

  // 위도경도가져와서 거리값 구하기 - 은유
  function NavigationInfo2(sigg, off) {
    let min_dist_index;

    if (off == "") {
      min_dist_index = 0;
      return min_dist_index;
    } else {
      for (let j = 0; j < off.length; j++) {
        let lat1 = sigg.Ma;
        let long1 = sigg.La;
        let lat2 = off[j].offi_lat;
        let long2 = off[j].offi_long;

        var radLat1 = (Math.PI * lat1) / 180;
        var radLat2 = (Math.PI * lat2) / 180;
        var theta = long1 - long2;
        var radTheta = (Math.PI * theta) / 180;
        var dist =
          Math.sin(radLat1) * Math.sin(radLat2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);

        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515 * 1.609344 * 1000;
        if (dist < 100) {
          dist = Math.round(dist / 10) * 10;
        } else {
          dist = Math.round(dist / 100) * 100;
        }
        cnt.push(dist);
      }
      // 깃 테스트 할려고 작성한 주석입니다.
      let tem = cnt[0];
      let num;
      for (let i = 1; i < cnt.length; i++) {
        if (tem > cnt[i]) {
          tem = cnt[i];
          num = i;
        }
      }
      setOffName(off[num].offi_name);
      setOfflocation(off[num].offi_location);
    }
    return 0;
  }

  function errorlist() {
    let a, b;

    if (problem[0].error_name == " ") {
      a = "최근 이상 내역이 없습니다";
      b = "";
    } else {
      a = problem[0].error_name;
      b = problem[0].error_date.substring(0, 10);
    }
    return [a, b];
  }

  function tlinfonumber() {
    let tlinfonum;
    if (data.title == undefined) {
      tlinfonum = "신호등 번호";
    } else {
      tlinfonum = data.title;
    }
    return tlinfonum;
  }

  function tlinfolocation() {
    let tlinfoloc;
    if (data.address == undefined) {
      tlinfoloc = "신호등 위치";
    } else {
      tlinfoloc = data.address;
    }
    return tlinfoloc;
  }

  return (
    <>
      <div className="main-yoo1">
        <nav className="nav22">
          <div className="navlogo2">
            <img className="iconlogo2" alt="" src="../iconlogo2.svg" />
          </div>
          <div className="navactions2">
            <button className="menu-icon2" onClick={onMenuIconClick}>
              <img className="vector-icon2" alt="" src="../vector.svg" />
            </button>
            <nav className="actions2">
              <nav className="container">
                <div className="div17" onclick={onMainContainerClick}>
                  메인화면
                </div>
                <div className="div18" onClick={ongrafContainerClick}>
                  그래프
                </div>
              </nav>
              <div className="account2">
                <div className="name-container">
                  <div className="name2">
                    <div className="div19">관리자</div>
                  </div>
                  <div className="logout2" onClick={onLogoutContainerClick}>
                    <div className="div20">로그아웃</div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </nav>
        <div className="ssss-parent">
          <div className="ssss">
            <div id="map"></div>
          </div>
          <div className="menulist-wrapper">
            <nav className="menulist">
              <div className="columns">
                <div className="police2">
                  <div className="div21">관할서 정보</div>

                  <div className="tittle13">{` ${offName}`}</div>
                  <br></br>
                  <div className="tittle17">{` ${offlocation}`}</div>
                  <div className="morepolice"></div>
                  <div className="morepolice-child" />
                  <div className="morepolice-child" />
                  <img
                    onClick={onMorePoliceContainerClick}
                    className="search-icon5"
                    alt=""
                    src="../16-search-icon5.svg"
                    data-scroll-to="searchIcon"
                  />
                </div>
              </div>
              <div className="error">
                <div className="police-child" />
                <div className="police-child" />
                <div className="columns1">
                  <div className="div22">이상내역</div>
                </div>
                <div className="tittle12">
                  {errorlist()[0]}
                  <br></br>
                  {errorlist()[1]}
                </div>
                <div className="moreerror" onClick={onMoreErrorContainerClick}>
                  <div className="moreerror-child" />
                  <img
                    className="search-icon6"
                    alt=""
                    src="../16-search-icon5.svg"
                  />
                </div>
              </div>

              <div className="info">
                <div className="police-child" />
                <div className="police-child" />
                <div className="tiaddress"></div>
                <div className="tiaddress1"></div>
                <div className="tlinfo">{tlinfonumber()}</div>
                <div className="columns2">
                  <div className="div23">{tlinfolocation()}</div>
                </div>
                <hr className="line"></hr>
                <div className="aimode1" onClick={openAImode}>
                  <div className="aimode-item" />
                  <div className="aimode-item" />
                  <div className="ai-mode1">AI Mode</div>
                </div>
                <div className="del1" onClick={openDel}>
                  <div className="del-item" />
                  <div className="del-item" />
                  <div className="ai-mode1">삭제</div>
                </div>
              </div>
              <div className="addbtn" onClick={openAdd}>
                <div className="police1"></div>
                <div className="columns3">
                  <div className="ai">AI 신호등 추가</div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {isAImodeOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeAImode}
        >
          <AImode onClose={closeAImode} />
        </PortalPopup>
      )}
      {isDelOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeDel}
        >
          <Del onClose={closeDel} />
        </PortalPopup>
      )}
      {isAddOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeAdd}
        >
          <Add onClose={closeAdd} />
        </PortalPopup>
      )}
    </>
  );
};

export default MainYoo1;
