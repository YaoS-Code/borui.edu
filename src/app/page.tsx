import Seo from '../utils/Seo';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import FAQ from '../components/FAQ';
import Gallery from '@/components/Gallery';

export default function HomePage() {
  return (
    <>
      <Seo
        title="Math & Coding Classes in Vancouver & Richmond"
        description="Borui Education offers expert math, coding, and AP courses for students in Vancouver & Richmond."
      />
      <Hero />
      <section id="courses" className="container">
        <h2>Our Courses at Borui Education</h2>
        <div className="course-list">
          <CourseCard
            title="Singapore Math"
            description="Master math fundamentals with our Singapore Math curriculum."
          />
          <CourseCard
            title="Math Competition Training"
            description="Prepare for Waterloo, AMC, and CCC competitions."
          />
          <CourseCard
            title="AP & IB Courses"
            description="Get ready for AP Calculus, AP Statistics, and IB Math HL."
          />
          <CourseCard
            title="Coding Classes"
            description="Learn Python, Java, and algorithm design."
          />
        </div>
      </section>
      <FAQ />
      <Gallery />
    </>
  );
}
