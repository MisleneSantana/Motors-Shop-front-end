import { useContext } from 'react';
import { AnnouncementList } from '../../components/AnnouncementList';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { SellerOrBuyerCard } from '../../components/SellerOrBuyerCard';
import { ModalContext } from '../../providers/Modal/ModalContext';
import { EditOrDeleteProfileModal } from '../../components/Modal/EditOrDeleteProfileModal';
import { EditAddressModal } from '../../components/Modal/EditAddressModal';
import {
  BuyerDashboardDivStyle,
  BuyerDashboardMainStyle,
  SpanBackgroundStyle,
} from './style';

export const BuyerDashboard = () => {
  const { isEditOrDeleteProfileModalOpen, isEditUserAddressModalOpen } =
    useContext(ModalContext);
  return (
    <>
      <BuyerDashboardDivStyle>
        <Header />
        {isEditOrDeleteProfileModalOpen ? <EditOrDeleteProfileModal /> : null}
        {isEditUserAddressModalOpen ? <EditAddressModal /> : null}
        <SpanBackgroundStyle></SpanBackgroundStyle>
        <BuyerDashboardMainStyle>
          <SellerOrBuyerCard />
          <section>
            <h3>Anúncios</h3>
            <AnnouncementList />
          </section>
        </BuyerDashboardMainStyle>
        <Footer />
      </BuyerDashboardDivStyle>
    </>
  );
};
