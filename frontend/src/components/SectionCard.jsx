import { Card, CardContent } from "@mui/material";

const SectionCard = ({ children, sx = {} }) => (
  <Card
    sx={{
      borderRadius: 4,
      boxShadow: "0 20px 50px rgba(17, 72, 71, 0.12)",
      border: "1px solid rgba(17, 72, 71, 0.08)",
      ...sx
    }}
  >
    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>{children}</CardContent>
  </Card>
);

export default SectionCard;
