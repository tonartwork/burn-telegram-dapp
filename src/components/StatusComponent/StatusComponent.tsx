import Image from 'next/image';
import { cn } from "@/lib/utils";

type StatusType = 'success' | 'error' | 'soldout';

interface StatusComponentProps {
  status: StatusType;
}

const statusContent = {
  success: {
    title: 'All done!',
    subtitle: 'Your NFT on the way',
    image: (
      <Image
        className="-ml-3"
        src="/images/success.png"
        alt="success"
        width={152}
        height={203}
        priority
      />
    )
  },
  error: {
    title: 'Something wrong!',
    subtitle: 'Try one more time',
    image: (
      <Image
        src="/images/error.png"
        alt="error"
        width={156}
        height={156}
        priority
      />
    )
  },
  soldout: {
    title: 'We are sold out!',
    subtitle: '',
    image: (
      <Image
        src="/images/soldout.png"
        alt="soldout"
        width={200}
        height={200}
        priority
      />
    )
  }
};

export const StatusComponent: React.FC<StatusComponentProps> = ({ status }) => {
  const content = statusContent[status];
  
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 mt-6">
      <h2 className="text-3xl font-semibold mb-2">
        {content.title}
      </h2>
      <h2 className="text-3xl font-semibold mb-2">
        {content.subtitle}
      </h2>
      <div className="mt-6">
        {content.image}
      </div>
    </div>
  );
};
