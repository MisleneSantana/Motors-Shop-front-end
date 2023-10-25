import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';
import {
  IPaginationAnnouncements,
  TAnnouncement,
  TAnnouncementRequest,
  TAnnouncementResponse,
} from '../../interfaces/announcement.interfaces';
import {
  IAnnouncementProviderProps,
  IAnnouncementProviderValues,
} from './ad.props';
import { LoadingContext } from '../Loading/LoadingContext';
import {
  TCommentRead,
  TCommentRequest,
  TCommentResponse,
} from '../../interfaces/comment.interfaces';
import { Toast } from '../../components/Toast';
import { ModalContext } from '../Modal/ModalContext';

export const AnnouncementContext = createContext<IAnnouncementProviderValues>(
  {} as IAnnouncementProviderValues
);

export const AnnouncementProvider = ({
  children,
}: IAnnouncementProviderProps) => {
  const [announcements, setAnnouncements] = useState<TAnnouncement[]>([]);
  const [adsPagination, setAdsPagination] = useState<IPaginationAnnouncements>(
    {} as IPaginationAnnouncements
  );
  const [singleAnnouncement, setSingleAnnouncement] = useState<
    TAnnouncement | undefined
  >({} as TAnnouncement);
  const [sellerAnnouncements, setSellerAnnouncements] = useState<
    TAnnouncement[]
  >([]);
  const [comments, setComments] = useState<TCommentResponse[]>([]);

  const { loading, setLoading } = useContext(LoadingContext);
  const { setIsSuccessModalOpen } = useContext(ModalContext);

  // 1. Leitura de todos os anúncios:
  useEffect(() => {
    const getAnnouncements = async () => {
      try {
        const { data } = await api.get<IPaginationAnnouncements>(
          '/announcements'
        );
        setAdsPagination(data);
        setAnnouncements(data.data);
      } catch (error) {
        Toast({ message: 'Não foi possível concluir sua solicitação.' });
      }
    };
    getAnnouncements();
  }, [loading]);

  // const getAnnouncements = async () => {
  //   try {
  //     const { data } = await api.get<IPaginationAnnouncements>(
  //       '/announcements'
  //     );
  //     setAdsPagination(data);
  //     setAnnouncements(data.data);
  //   } catch (error) {
  //     Toast({ message: 'Não foi possível concluir sua solicitação.' });
  //   }
  // };

  // 2. Cria um novo anúncio:
  const createAnnouncement = async (formData: TAnnouncementRequest) => {
    try {
      const userToken = localStorage.getItem('@user:token');
      const response = await api.post<TAnnouncementResponse>(
        `/announcements`,
        formData,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setAnnouncements((announcements) => [...announcements, response.data]);
      setIsSuccessModalOpen(true);

      // await getAnnouncements();
      return response;
    } catch (error) {
      Toast({
        message: 'Não foi possível concluir sua solicitação.',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Buscar um anúncio por id:
  const getAnnouncement = async (announcementId: string | undefined) => {
    try {
      const { data } = await api.get<TAnnouncementResponse>(
        `announcements/${announcementId}`
      );
      setSingleAnnouncement(data);
    } catch (error) {
      Toast({ message: 'Não foi possível concluir sua solicitação.' });
    }
  };

  // 4. Buscar os anúncios de um anunciante:
  const getAnnouncementsBySeller = async (sellerId: string | undefined) => {
    try {
      const { data } = await api.get<TAnnouncementResponse[]>(
        `announcements/${sellerId}/seller`
      );
      setSellerAnnouncements(data);
    } catch (error) {
      Toast({ message: 'Não foi possível concluir sua solicitação.' });
    }
  };

  // 5. Atualizar um anúncio:
  const updateAnnouncement = async (
    formData: Partial<TAnnouncementRequest>,
    announcementId: string
  ) => {
    try {
      const token = localStorage.getItem('@user:token');
      const { data } = await api.patch(
        `announcements/${announcementId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAnnouncements((announcements) => {
        const updateAd = announcements.map((ad) =>
          ad.id === announcementId
            ? { ...announcements, ...data }
            : announcements
        );
        return updateAd;
      });

      setSingleAnnouncement(data);
      // await getAnnouncements();
      Toast({ message: 'Anúncio atualizado com sucesso', successful: true });
    } catch (error) {
      Toast({ message: 'Não foi possível concluir sua solicitação.' });
    }
  };

  // 6. Deletar um anúncio:
  const deleteAnnouncement = async (announcementId: string) => {
    try {
      const token = localStorage.getItem('@user:token');
      await api.delete(`announcements/${announcementId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const listWithoutAd = announcements.filter(
        (announcement) => announcement.id !== announcementId
      );

      setAnnouncements(listWithoutAd);
      setSellerAnnouncements(listWithoutAd);
      Toast({ message: 'Anúncio deletado com sucesso', successful: true });
    } catch (error) {
      Toast({ message: 'Não foi possível concluir sua solicitação.' });
    }
  };

  // 7. Criar um comentário:
  const createComment = async (
    formData: TCommentRequest,
    announcementId: string
  ) => {
    try {
      const token = localStorage.getItem('@user:token');

      const { data } = await api.post<TCommentResponse>(
        `/comments/${announcementId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((comments) => [...comments, data]);

      await getComments(announcementId);

      Toast({ message: 'Comentário criado com sucesso', successful: true });
      return data;
    } catch (error) {
      Toast({ message: 'Não foi possível concluir sua solicitação.' });
    } finally {
      setLoading(false);
    }
  };

  // 8. Listar os comentários de um anúncio:
  const getComments = async (announcementId: string) => {
    try {
      const token = localStorage.getItem('@user:token');
      const { data } = await api.get<TCommentRead>(
        `/comments/${announcementId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      data.length === 0
        ? Toast({
            message: 'Este anúncio não possui comentários',
            successful: true,
          })
        : setComments(data);
    } catch (error) {
      Toast({ message: 'Não foi possível concluir sua solicitação.' });
    }
  };

  // 9. Atualizar o comentário de um anúncio:
  const updateComment = async (
    formData: TCommentRequest,
    commentId: string
  ) => {
    try {
      const token = localStorage.getItem('@user:token');
      const { data } = await api.patch(`/comments/${commentId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((comments) => {
        const updateComment = comments.map((comment) =>
          comment.id === commentId ? { ...comments, ...data } : comments
        );
        return updateComment;
      });
      Toast({ message: 'Comentário atualizado com sucesso', successful: true });
    } catch {
      Toast({ message: 'Não foi possível concluir sua solicitação.' });
    }
  };

  // 10. Deletar um comentário:
  const deleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('@user:token');
      await api.delete<void>(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const listWithoutComment = comments.filter(
        (comment) => comment.id !== commentId
      );

      setComments(listWithoutComment);
      Toast({ message: 'Comentário deletado com sucesso', successful: true });
    } catch (error) {
      Toast({ message: 'Não foi possível concluir sua solicitação.' });
    }
  };

  // useEffect(() => {
  //   const token = localStorage.getItem('@user:token');
  //   (async () => {
  //     api.defaults.headers.common.authorization = `Bearer ${token}`;
  //     await getAnnouncements();
  //   })();
  // }, []);

  useEffect(() => {
    if (singleAnnouncement && singleAnnouncement.id) {
      getComments(singleAnnouncement!.id);
    }
  }, [singleAnnouncement]);

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        setAnnouncements,
        adsPagination,
        setAdsPagination,
        singleAnnouncement,
        sellerAnnouncements,
        // getAnnouncements,
        createAnnouncement,
        getAnnouncement,
        getAnnouncementsBySeller,
        updateAnnouncement,
        deleteAnnouncement,
        comments,
        setComments,
        createComment,
        getComments,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};
