import CourseCard from '@/components/CourseCard';
import FAQ from '@/components/FAQ';
import styles from '@/styles/CoursePage.module.css';

export default function CoursesPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Our Courses</h1>
      {/* Horizontal Scrollable Course Cards */}
      <div className={styles.courseSlider} >
        <CourseCard
          title="Singapore Math"
          description="Master math fundamentals with our Singapore Math curriculum."
        />
        <CourseCard
          title="AP Calculus"
          description="Comprehensive preparation for AP Calculus AB & BC exams."
        />
        <CourseCard
          title="Python Programming"
          description="Learn Python programming for beginners and advanced students."
        />
        <CourseCard
          title="Math Competitions"
          description="Prepare for math competitions like AMC, Waterloo, and more."
        />
      </div>
      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}
