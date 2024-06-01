import React from "react";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import MenuFooter from "./MenuFooter";
import Social from "./Social";
// import { navData } from "../header/navData";

const Footer = () => {
  return (
    <footer className="w-full bg-bgPrimary">
      <div className="w-full h-full pt-[70px]">
        <div className="flex gap-[20px] h-full mx-auto max-w-[1230px] border-solid border-b-[1px] border-[#dae1e7]">
          <div className="w-[25%] px-[15px] pb-[30px]">
            <h3 className="text-white text-[20px] font-semibold mb-[10px] uppercase">
              Giới thiệu
            </h3>
            <div className="w-[50px] h-[3px] my-[16px] bg-red-600"></div>
            <ul className="text-[14px] text-[#a4a4a4]">
              Chào mừng bạn đến với ShoesPlus! Tại đây, mỗi một dòng chữ, mỗi
              chi tiết và hình ảnh đều là những bằng chứng mang dấu ấn lịch sử
              Converse 100 năm, và đang không ngừng phát triển lớn mạnh.
            </ul>
          </div>

      <div className="footer-cre">
        <p className="w-full text-center pt-[10px] pb-[15px] text-white/50">
          © Bản quyền thuộc về{" "}
          <a className="text-white/80" href="">
            {" "}
            ShoesShopping
          </a>
        </p>
      </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
