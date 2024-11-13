"use client"
import { useState } from 'react';
import styles from '@/styles/FAQ.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What is Singapore Math?',
    answer: 'Singapore Math focuses on understanding math concepts through problem-solving and visualization, making it more effective than traditional methods.',
  },
  {
    question: 'How do I enroll my child in AP courses?',
    answer: 'To enroll your child, simply contact us through our website or call our office to schedule a consultation.',
  },
  {
    question: 'Do you offer online classes?',
    answer: 'Yes, we offer both in-person and online classes to accommodate your child’s schedule and needs.',
  },
  {
    question: 'What coding languages do you teach?',
    answer: 'We teach Python, Java, and algorithm design to help students excel in coding competitions and software development.',
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className={styles.faq}>
      <h2>Frequently Asked Questions</h2>
      <div className={styles.faqList}>
        {faqData.map((faq, index) => (
          <div key={index} className={styles.faqItem}>
            <button onClick={() => toggleFAQ(index)} className={styles.question}>
              {faq.question}
            </button>
            {activeIndex === index && <p className={styles.answer}>{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
