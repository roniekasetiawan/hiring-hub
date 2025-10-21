import Image from "next/image";
import React from "react";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  imageSrc: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  imageSrc,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-20 text-center space-y-4">
      <Image src={imageSrc} alt={title} width={240} height={240} priority />
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="max-w-lg text-sm text-slate-500">{subtitle}</p>
    </div>
  );
};

export default EmptyState;
