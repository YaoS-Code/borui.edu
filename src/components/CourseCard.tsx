import styles from '@/styles/CourseCard.module.css';

interface CourseCardProps {
  title: string;
  description: string;
  link?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description, link }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {link && (
        <a href={link} className={styles.button} target="_blank" rel="noopener noreferrer">
          Learn More
        </a>
      )}
    </div>
  );
};

export default CourseCard;
