import React from "react";
import Loader from "react-js-loader";
// import {grey, red} from '@mui/material/colors'
import { DNA } from "react-loader-spinner";
const LoaderH = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      {/* <div className="loader"></div> */}
      {/* <Loader
              type="rectangular-ping"
              bgColor="#1030A4" 
              color="white"      
              // title="Loading..."
              size= {250}            
          /> */}

      {/* <DNA
        visible={true}
        height="150"
        width="150"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      /> */}

      <div class="loading">
        <svg className="w-[100px] lg:w-[140px] 2xl:w-[220px] h-[70px] 2xl:h-[110px] flex justify-center items-center">
          <polyline
            className="scale-[3.5] md:scale-[4] lg:scale-[5] 2xl:scale-[8]"
            id="back"
            points="1 6 4 6 6 11 10 1 15 11 19 1 21 6 25 6"
          ></polyline>
          <polyline
            className="scale-[3.5] md:scale-[4] lg:scale-[5] 2xl:scale-[8]"
            id="front"
            points="1 6 4 6 6 11 10 1 15 11 19 1 21 6 25 6"
          ></polyline>
        </svg>
      </div>
    </div>
  );
};

export default LoaderH;
