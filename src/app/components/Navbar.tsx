"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const t = useTranslations("navbar");
  const [navbar, setNavbar] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const selectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    setSelectedLanguage(nextLocale);
    localStorage.setItem("preferredLanguage", nextLocale);

    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    router.replace(`/${nextLocale}/${pathWithoutLocale}`);
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem("preferredLanguage") || "en";
    setSelectedLanguage(savedLocale);

    const currentLocale = pathname.split("/")[1];
    if (currentLocale !== savedLocale) {
      router.replace(`/${savedLocale}${pathname.split("/").slice(2).join("/")}`);
    }
  }, [pathname]);

  const toggleNavbar = () => {
    setNavbar((prevState) => !prevState);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setNavbar(true);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && !navbar) {
        setNavbar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    if (!navbar) {
      document.addEventListener("click", handleClickOutside);
    }

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [navbar]);

  return (
    <nav className="flex items-center text-white justify-between md:px-12 px-5 text-xl bg-gradient-to-l from-[#7DAAB6] via-[#8EB7C4] to-[#82B3C5]">
      <div>
        <Image src={logo} width={140} alt="logo" />
      </div>
      <div ref={menuRef}>
        <ul className={`${navbar ? "md:flex gap-4 hidden" : "items-center gap-4 md:flex absolute bg-blue-400 rounded-md py-4 px-6 right-9"}`}>
          <li>
            <a href={"#about"} className="group relative custom-link">
              {t("About")}
            </a>
          </li>
          <li>
            <a href={"#countries"} className="group relative custom-link">
              {t("Countries")}
            </a>
          </li>
          <li className="relative group">
            <a href={"#services"} className="relative custom-link">
              {t("Services")}
            </a>
            <Link href={`/${selectedLanguage}/course`} className="absolute left-0 text-xs w-[8vw] hidden group-hover:block bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded z-10">
              {t("Company")}
            </Link>
          </li>
          <li>
            <a href={"#news"} className="group relative custom-link">
              {t("News")}
            </a>
          </li>
          <li>
            <a href={`/${selectedLanguage}/members`} className="group relative custom-link">
              {t("Members")}
            </a>
          </li>
        </ul>
      </div>
      <div className="">
        <select className="text-[#000080] bg-transparent rounded-md border border-[#000080] py-1 px-2" onChange={selectChange} value={selectedLanguage}>
          <option value="en">English</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      <div className="md:hidden static" onClick={toggleNavbar}>
        {navbar ? <FontAwesomeIcon icon={faBars} width={30} /> : <FontAwesomeIcon icon={faXmark} width={30} />}
      </div>
    </nav>
  );
}
