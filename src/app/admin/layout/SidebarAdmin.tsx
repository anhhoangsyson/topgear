"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  TableIcon,
  BoxIconLine,
  ChatIcon
} from "@/app/admin/icons/index";
import { useSidebar } from "@/context/admin/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/admin/dashboard/ecommerce", pro: false }],
  },
  {
    name: "Danh mục",
    icon: <ListIcon />,
    subItems: [
      { name: "Danh sách danh mục", path: "/admin/category", pro: false },
      { name: "Thêm danh mục", path: "/admin/category/add", pro: false },
    ],
  },
  {
    name: "Laptop",
    icon: <TableIcon />,
    subItems: [
      { name: "Danh sách laptop", path: "/admin/laptop", pro: false },
      { name: "Thêm laptop", path: "/admin/laptop/add", pro: false },

    ],
  },
  {
    name: "Thương hiệu",
    icon: <PageIcon />,
    subItems: [
      { name: "Danh sách thương hiệu", path: "/admin/brand", pro: false },
      { name: "Thêm thương hiệu", path: "/admin/brand/add", pro: false },
    ],
  },
  {
    name: "Đơn hàng",
    icon: <BoxIconLine />,
    subItems: [
      { name: "Danh sách đơn hàng", path: "/admin/orders", pro: false },
    ],
  },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },
];

const othersItems: NavItem[] = [
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/admin-chart", pro: false },
  //     { name: "Bar Chart", path: "/admin-chart", pro: false },
  //   ],
  // },
  {
    icon: <BoxCubeIcon />,
    name: "Laptop Group",
    subItems: [
      { name: "Danh sách nhóm", path: "/admin/laptop-group", pro: false },
      { name: "Thêm nhóm mới", path: "/admin/laptop-group/add", pro: false },
      // { name: "Badge", path: "/admin", pro: false },
      // { name: "Buttons", path: "/admin", pro: false },
      // { name: "Images", path: "/admin", pro: false },
      // { name: "Videos", path: "/admin", pro: false },
    ],
  },
  {
    icon: <ListIcon />,
    name: "Blog",
    subItems: [
      { name: "Danh sách blog", path: "/admin/blog", pro: false },
      { name: "Tạo blog mới", path: "/admin/blog/add", pro: false },
    ],
  },
  {
    icon: <ChatIcon />,
    name: "Bình luận",
    subItems: [
      { name: "Quản lý bình luận", path: "/admin/comments", pro: false },
    ],
  },
];

const SidebarAdmin: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm group text-nowrap transition delay-150 duration-300 ease-in-out ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "bg-blue-50 text-blue-500 dark:bg-blue-500/[0.12] dark:text-blue-400"
                : "text-gray-700 hover:bg-gray-100 group-hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`text-nowrap  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-blue-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm group ${isActive(nav.path)
                  ? "bg-blue-50 text-blue-500 dark:bg-blue-500/[0.12] dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-100 group-hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span
                    className={`relative flex items-center w-full gap-3 font-medium rounded-lg text-theme-sm-text`}
                  >
                    {nav.name}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-theme-sm font-medium ${isActive(subItem.path)
                        ? "bg-blue-50 text-blue-500 dark:bg-blue-500/[0.12] dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "bg-blue-100 dark:bg-blue-500/20"
                              : "bg-blue-50 group-hover:bg-blue-100 dark:bg-blue-500/15 dark:group-hover:bg-blue-500/20"
                              } block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase text-blue-500 dark:text-blue-400 `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "bg-blue-100 dark:bg-blue-500/20"
                              : "bg-blue-50 group-hover:bg-blue-100 dark:bg-blue-500/15 dark:group-hover:bg-blue-500/20"
                              } block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase text-blue-500 dark:text-blue-400 `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-4 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/logo.svg"
                alt="E-COM Logo"
                width={120}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/logo.svg"
                alt="E-COM Logo"
                width={120}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/logo-icon.svg"
              alt="E-COM Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
        {isExpanded || isHovered || isMobileOpen ? <></> : null}
      </div>
    </aside>
  );
};

export default SidebarAdmin;
