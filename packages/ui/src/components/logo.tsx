import { cn } from "@/lib/utils"

const Logo = ({
    className = "",
    highClassName = "",
    lowClassName = "",
    highStyle = {},
    lowStyle = {},
}: {
    className?: string
    highClassName?: string
    lowClassName?: string
    highStyle?: React.CSSProperties
    lowStyle?: React.CSSProperties
}) => (
    <svg
        viewBox="129 -24 1529 1003"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("size-12", className)}
    >
        {/* $ Glyph */}
        <g
            transform="translate(100, 100)"
            className={cn("fill-foreground", highClassName)}
            style={highStyle}
        >
            <path d="M623 510C648 512 687 512 731 512C807 512 902 509 958 504C959 521 959 538 959 553C959 676 898 733 660 748C662 798 665 837 670 879C610 878 554 878 496 878C435 878 380 878 320 879C325 837 328 797 330 746C117 727 29 660 29 523C29 379 85 310 394 288C549 276 568 253 568 215C568 185 550 169 472 169C394 169 371 187 371 230V245C348 244 317 243 283 243C195 243 103 249 36 253C33 232 32 213 32 195C32 75 95 18 328 2C327 -45 324 -83 319 -124H494H670C665 -83 662 -45 661 2C899 21 974 89 974 223C974 388 898 444 622 467C447 482 430 505 430 542C430 568 449 584 522 584C603 584 623 568 623 528Z" />
        </g>

        {/* < Glyph */}
        <g
            transform="translate(1100, 100)"
            className={cn("fill-brand", lowClassName)}
            style={lowStyle}
        >
            <path d="M230 381C336 396 477 417 558 433C558 475 553 611 555 699C417 640 164 523 29 469C31 444 32 412 32 375C32 338 31 305 29 280C163 227 417 110 555 51C552 146 558 274 558 320C477 336 336 357 230 372Z" />
        </g>
    </svg>
)

export default Logo
