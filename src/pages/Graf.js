// import { useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import "./Graf.css";
import Barchart from "../components/Barch";
import Barchart1 from "../components/Barch1";
import Navs from "../components/Navs";

const Graf = () => {
  return (
    <div className="graf">
      <Navs />
      <div className="total-revenue-wrapper">
        <div className="total-revenue">
          <div className="allgraf">
            <h1 className="h11">
              사고발생률 약 <span className="h22">20%</span> 감소했습니다
            </h1>
            <Barchart />
            {/* <h1 className="text1">사고 발생율</h1> */}
          </div>

          <div className="graf2">
            <h1 className="h12">
              차량교통량 약 <span className="h22">20%</span> 증가했습니다.
            </h1>
            <Barchart1 />
            {/* <h1 className="text2">차량 통행량</h1> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graf;
