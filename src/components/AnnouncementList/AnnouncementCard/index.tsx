import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../../providers/Auth/AuthContext';
import { AnnouncementContext } from '../../../providers/Ad/AdContext';
import { EditOrDeleteAnnouncement } from '../../Form/EditOrDeleteAnnouncement';
import { TAnnouncementResponse } from '../../../interfaces/announcement.interfaces';
import { DeleteAdModal } from '../../Modal/DeleteAdModal';

export interface IAnnouncementProps {
  announcement: TAnnouncementResponse;
}

export const AnnouncementCard = ({ announcement }: IAnnouncementProps) => {
  const route = useLocation();
  const location = `${route.pathname}`;
  const userId = localStorage.getItem('@user:id');
  const { user } = useContext(AuthContext);
  const { getAnnouncement } = useContext(AnnouncementContext);

  const [isEditOrDeleteAdsModalOpen, setIsEditOrDeleteAdsModalOpen] =
    useState(false);
  const [isConfirmDeleteAdModalOpen, setIsConfirmDeleteAdModalOpen] =
    useState(false);

  return (
    <>
      <li>
        <img src={announcement?.cover_image_url} alt={announcement?.brand} />
        <h4>
          {announcement?.brand} - {announcement?.model}
        </h4>
        <p>{announcement?.description}</p>
        {location === '/' || location === '/buyerHome' ? (
          <div>
            <span>{announcement.user?.name.charAt(0)}</span>
            <p>{announcement.user?.name}</p>
          </div>
        ) : null}
        <div>
          <div>
            <p>{announcement.km} KM</p>
            <p>{announcement.year}</p>
          </div>
          <p>
            R${' '}
            {announcement.price?.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div>
          {location === '/sellerHome' &&
          user?.account_type?.toLowerCase() === 'seller' &&
          user?.id === userId ? (
            <>
              <div>
                <button onClick={() => setIsEditOrDeleteAdsModalOpen(true)}>
                  Editar
                </button>
                {isEditOrDeleteAdsModalOpen ? (
                  <>
                    <div>
                      <EditOrDeleteAnnouncement
                        announcement={announcement}
                        setIsEditOrDeleteAdsModalOpen={
                          setIsEditOrDeleteAdsModalOpen
                        }
                        setIsConfirmDeleteAdModalOpen={
                          setIsConfirmDeleteAdModalOpen
                        }
                      />
                    </div>
                  </>
                ) : null}
                <Link
                  to='/product'
                  onClick={() => getAnnouncement(announcement.id)}
                >
                  Ver detalhes
                </Link>
              </div>
              <div>
                {isConfirmDeleteAdModalOpen ? (
                  <DeleteAdModal
                    announcement={announcement}
                    setIsConfirmDeleteAdModalOpen={
                      setIsConfirmDeleteAdModalOpen
                    }
                  />
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </li>
    </>
  );
};
