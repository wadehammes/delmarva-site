import { RichText } from "src/components/RichText/RichText.component";
import type { ContentTestimonialType } from "src/contentful/parseContentTestimonial";
import styles from "./ContentTestimonial.module.css";

interface ContentTestimonialProps {
  testimonial: ContentTestimonialType;
}

export const ContentTestimonial = (props: ContentTestimonialProps) => {
  const { testimonial } = props;

  return (
    <div className={styles.testimonial}>
      <div className={styles.testimonialQuoteMark}>
        <span>"</span>
      </div>
      <RichText
        className={styles.testimonialQuote}
        document={testimonial.quote}
      />
      <div className={styles.testimonialAuthor}>
        <div className={styles.testimonialAuthorName}>
          {testimonial.quoterName}
        </div>
        <div className={styles.testimonialAuthorTitle}>
          {testimonial.quoterTitle}
        </div>
      </div>
    </div>
  );
};
