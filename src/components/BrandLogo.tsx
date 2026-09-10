import Image from "next/image";

export function BrandLogo({ inverted = false }: { inverted?: boolean }) {
    return (
        <Image
            src="/ms-infra-logo.svg"
            alt="MS Infra"
            width={142}
            height={47}
            priority
            className={inverted ? "brand-logo brand-logo-inverted" : "brand-logo"}
        />
    );
}
