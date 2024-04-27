import styles from './TodoCardModal.module.scss';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import httpClient from '@/src/apis/httpClient';
import useModal from '@/src/hooks/useModal';
import DoubleButtonModal from '../../DoubleButtonModal';
import TodoEditModal from '../TodoEditModal/TodoEditModal';
import TagChip from '../../ModalInput/TagInput/TagChip';
import CommentInput from '../../ModalInput/CommentInput/CommentInput';
import CommentBox from './CommentBox';
import kebab from '@/src/assets/icons/kebab.svg';

type Card = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  assignee?: {
    id: number;
    nickname: string;
    profileImageUrl?: string;
  };
  imageUrl?: string;
  teamId: string;
  dashboardId: number;
  columnId: number;
  createdAt: string;
  updatedAt: string;
};

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  cardId: number;
  author: {
    id: number;
    nickname: string;
    profileImageUrl?: string;
  };
};

type ColumnData = {
  id: number;
  title: string;
  teamId: string;
  dashboardId: number;
  createdAt: string;
  updatedAt: string;
};

const TodoCardModal = () => {
  const [cardData, setCardData] = useState<Card>();
  const [commentData, setCommentData] = useState<Comment[]>([]);
  const [columnTitle, setColumnTitle] = useState<string | undefined>('');
  const [commentInput, setCommentInput] = useState<string>('');
  const [isKebabOpen, setIsKebabOpen] = useState<boolean>(false);
  const { modalState, openModal, closeModal } = useModal();

  //카드 데이터 가져오기
  const fetchCardData = async () => {
    try {
      const response = await httpClient.get('/cards/4990');
      setCardData(response.data);
    } catch (error) {
      console.error('카드 데이터 가져오기 실패:', error);
    }
  };

  //댓글 데이터 가져오기
  const fetchCommentData = async () => {
    try {
      const response = await httpClient.get('/comments?size=10&cardId=4990');
      setCommentData(response.data.comments);
    } catch (error) {
      console.error('댓글 데이터 가져오기 실패:', error);
    }
  };

  //컬럼명(상태) 가져오기
  const fetchColumnTitle = async () => {
    try {
      const response = await httpClient.get(`/columns?dashboardId=5911`);
      const column = response.data.data.find((column: ColumnData) => column.id === cardData?.columnId);
      setColumnTitle(column?.title);
      console.log(column?.title);
    } catch (error) {
      console.error('컬럼 데이터 가져오기 실패:', error);
    }
  };

  //컴포넌트가 마운트되면 카드 데이터, 댓글 데이터, 컬럼명 가져오기
  useEffect(() => {
    fetchCardData();
    fetchCommentData();
    fetchColumnTitle();
  }, []);

  //댓글 입력창 핸들러
  const handleCommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentInput(e.target.value);
  };

  //댓글 제출 핸들러
  const handleCommentSubmit = async () => {
    try {
      const response = await httpClient.post('/comments', {
        content: commentInput,
        cardId: cardData?.id,
        columnId: cardData?.columnId,
        dashboardId: cardData?.dashboardId,
      });
      console.log('댓글 작성 성공:', response.data);
      fetchCommentData();
      setCommentInput('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  //댓글 수정 핸들러 (로직 수정 필요)
  const handleCommentEdit = async (commentId: number, content: string) => {
    try {
      const response = await httpClient.put(`/comments/${commentId}`, {
        content: content,
      });
      console.log('댓글 수정 성공:', response.data);
      fetchCommentData();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  //댓글 삭제 핸들러
  const handleCommentDelete = async (commentId: number) => {
    try {
      const response = await httpClient.delete(`/comments/${commentId}`);
      console.log('댓글 삭제 성공:', response.data);
      fetchCommentData();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  //카드 삭제 핸들러
  const handleCardDelete = async () => {
    try {
      const response = await httpClient.delete(`/cards/4990`);
      console.log('카드 삭제 성공', response.data);
      closeModal();
    } catch (error) {
      console.error('카드 삭제 실패:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.kebabBox}>
        <button onClick={() => setIsKebabOpen(!isKebabOpen)}>
          <Image className={styles.kebab} src={kebab} width={28} height={28} alt="케밥" />
        </button>
        {isKebabOpen && (
          <div className={styles.popOver}>
            <button className={styles.option} onClick={openModal}>
              수정하기
            </button>
            <button className={styles.option} onClick={handleCardDelete}>
              삭제하기
            </button>
          </div>
        )}
        {modalState && cardData && (
          <DoubleButtonModal size={'large'} isOpen={modalState} onClose={closeModal}>
            <TodoEditModal data={cardData} />
          </DoubleButtonModal>
        )}
      </div>
      <div className={styles.contentBox}>
        <div className={styles.title}>{cardData?.title}</div>
        <div className={styles.chipBox}>
          <div className={styles.columnChip}>
            <span className={styles.circle}>•</span>
            {columnTitle}
          </div>
          <div className={styles.line}> | </div>
          <div className={styles.tagChip}>
            {cardData?.tags.map((name, index) => (
              <TagChip key={index} name={name} />
            ))}
          </div>
        </div>
        <div className={styles.description}>{cardData?.description}</div>
        <img src={cardData?.imageUrl} className={styles.todoImage} />
        <CommentInput value={commentInput} onChange={handleCommentInput} onClick={handleCommentSubmit} />
        {commentData && (
          <div className={styles.commentBox}>
            {commentData?.map(comment => (
              <CommentBox
                key={comment.id}
                data={comment}
                assigneeId={cardData?.assignee?.id}
                onDeleteComment={handleCommentDelete}
                onEditComment={handleCommentEdit}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles.infoBox}>
        <div className={styles.assigneeBox}>
          <div className={styles.assigneeTitle}>담당자</div>
          <div className={styles.assigneeProfile}>
            <img src={cardData?.assignee?.profileImageUrl} className={styles.profileImage} />
            <div className={styles.assigneeNickname}>{cardData?.assignee?.nickname}</div>
          </div>
        </div>
        <div className={styles.dueDateBox}>
          <div className={styles.dueDateTitle}>마감일</div>
          <div className={styles.dueDate}>{cardData?.dueDate}</div>
        </div>
      </div>
    </div>
  );
};

export default TodoCardModal;
