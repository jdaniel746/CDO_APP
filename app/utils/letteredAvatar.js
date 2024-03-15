export default function LetteredAvatar({ name }) {
    function getInitials(name) {
        return `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`;
    }

    function generateBackground(name) {
        let hash = 0;
        let i;

        for (i = 0; i < name.length; i += 1) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = "#";

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    let initials = getInitials(name);
    let color = generateBackground(name);
    const customStyle = {
        display: "flex",
        height: "50px",
        width: "50px",
        borderRadius: "100px",
        color: "white",
        background: color,
        margin: "auto"
    };

    return (
        <div style={customStyle}>
            <span style={{ margin: "auto" }}> {initials} </span>
        </div>
    );
}