import {
  FileAddOutlined,
  FileSearchOutlined,
  HomeOutlined,
  MoneyCollectOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";

const StyledMainLayout = styled.div`
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
`;
const StyledAsideContainer = styled.aside`
  width: 300px;
  border: 1px solid #dbdbdb;
  background: #f3f4f6;
  position: sticky;
  top: 0;
  left: 0;

  .list-container {
    display: flex;
    height: 100%;
    flex-direction: column;
    overflow-y: auto;
    padding: 16px 12px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
    .list {
      margin-top: 0.5rem;
      .list-item {
        display: flex;
        align-items: center;
        border-radius: 8px;
        padding: 8px;
        color: #374151;
        font-weight: 600;
        cursor: pointer;
        :hover {
          background: #ebeef1;
        }
        .icon {
          margin: 0 12px;
        }
        .content {
          margin-left: 12px;
          font-size: 16px;
        }
      }
      .active {
        background: #d1d5db;
        :hover {
          background: #d1d5db;
        }
      }
    }
  }
`;
const StyledMainContainer = styled.main`
  height: 100%;
  flex: 1;
  position: relative;
  overflow-y: auto;
`;
const StyledHeader = styled.div`
  width: 100%;
  height: 56px;
  background: #f3f4f6;
  display: flex;
  align-items: center;

  .header-content {
    font-weight: 600;
    font-size: 20px;
    margin-left: 20px;
  }
`;
const StyledMainContent = styled.div`
  padding: 16px 12px;
`;
const MainLayout = ({ children }: { children?: ReactNode }) => {
  const router = useRouter();
  const [activeId, setActiveId] = useState(0);
  useEffect(() => {
    if (router.asPath.split("/").includes("nhap_hoa_don")) {
      setActiveId(1);
    } else if (router.asPath.split("/").includes("danh_sach_hoa_don")) {
      setActiveId(2);
    } else if (router.asPath.split("/").includes("danh_sach_khach_hang")) {
      setActiveId(3);
    } else if (router.asPath.split("/").includes("tim_kiem_hoa_don")) {
      setActiveId(4);
    } else if (router.asPath.split("/").includes("tim_kiem_khach_hang")) {
      setActiveId(5);
    } else if (router.asPath.split("/").includes("tra_no")) {
      setActiveId(6);
    }
  }, [router]);
  return (
    <StyledMainLayout>
      <StyledAsideContainer aria-label="Side bar">
        <div className="list-container">
          <ul className="list">
            <Link href="/">
              <li className={`list-item ${activeId === 0 && "active"}`}>
                <div className="icon">
                  <HomeOutlined />
                </div>
                <span className="content">Trang Chủ</span>
              </li>
            </Link>
            <Link href="/nhap_hoa_don">
              <li className={`list-item ${activeId === 1 && "active"}`}>
                <div className="icon">
                  <FileAddOutlined />
                </div>
                <span className="content">Nhập hoá đơn</span>
              </li>
            </Link>
            <Link href="/danh_sach_hoa_don">
              <li className={`list-item ${activeId === 2 && "active"}`}>
                <div className="icon">
                  <UnorderedListOutlined />
                </div>
                <span className="content">Danh sách hoá đơn</span>
              </li>
            </Link>
            <Link href="/danh_sach_khach_hang">
              <li className={`list-item ${activeId === 3 && "active"}`}>
                <div className="icon">
                  <UnorderedListOutlined />
                </div>
                <span className="content">Danh sách khách hàng</span>
              </li>
            </Link>
            <Link href="/tim_kiem_hoa_don">
              <li className={`list-item ${activeId === 4 && "active"}`}>
                <div className="icon">
                  <FileSearchOutlined />
                </div>
                <span className="content">Tìm kiếm hoá đơn</span>
              </li>
            </Link>
            <Link href="/tim_kiem_khach_hang">
              <li className={`list-item ${activeId === 5 && "active"}`}>
                <div className="icon">
                  <SearchOutlined />
                </div>
                <span className="content">Tìm kiếm khách hàng</span>
              </li>
            </Link>
            <Link href="/tra_no">
              <li className={`list-item ${activeId === 6 && "active"}`}>
                <div className="icon">
                  <MoneyCollectOutlined />
                </div>
                <span className="content">Trả nợ</span>
              </li>
            </Link>
          </ul>
        </div>
      </StyledAsideContainer>
      <StyledMainContainer>
        <StyledHeader>
          <div className="header-content">Nhập hoá đơn</div>
        </StyledHeader>
        <StyledMainContent>{children}</StyledMainContent>
      </StyledMainContainer>
    </StyledMainLayout>
  );
};

export default MainLayout;
