"use client";

import Image from "next/image";
import { Modal } from "src/components/Modal/Modal.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ContentCardType } from "src/contentful/parseContentCard";
import styles from "./ContentCardModal.module.css";

interface ContentCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentCard: ContentCardType | null;
}

export const ContentCardModal = ({
  isOpen,
  onClose,
  contentCard,
}: ContentCardModalProps) => {
  if (!contentCard) {
    return null;
  }

  const { media, modalCopy } = contentCard;

  return (
    <Modal
      closeOnClickOutside={true}
      closeOnEscape={true}
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      size="small"
    >
      <Modal.Body>
        <div className={styles.mediaSection}>
          {media ? (
            <Image
              alt={media.alt}
              height={media.height}
              src={media.src}
              style={{
                height: "auto",
                maxWidth: `${media.width}px`,
                objectFit: "cover",
                objectPosition: "center",
              }}
              width={media.width}
            />
          ) : null}
        </div>
        <div className={styles.contentSection}>
          <div className={styles.descriptionSection}>
            <RichText document={modalCopy} />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
