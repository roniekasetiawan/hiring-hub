"use client";

import { type ReactNode, useEffect, useState } from "react";
import { Box, Button, Divider, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthenticationProvider } from "@/context/AuthenticationProvider";

const HeaderProfile = (): Readonly<ReactNode> => {
  const router = useRouter();
  const { user } = useAuthenticationProvider();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {
    } finally {
      setAnchorEl(null);
      router.push("/login");
      router.refresh();
    }
  };

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    const storedAvatar = localStorage.getItem("userAvatar");
    if (storedAvatar) {
      setAvatarSrc(storedAvatar);
    } else {
      const randomIndex = Math.floor(Math.random() * 8) + 1;
      const newAvatar = `/assets/images/avatars/ava_${randomIndex}.png`;
      localStorage.setItem("userAvatar", newAvatar);
      setAvatarSrc(newAvatar);
    }
  }, []);

  return (
    <Box>
      <button
        aria-label="Open user menu"
        onClick={handleAvatarClick}
        className="hover:cursor-pointer relative inline-flex items-center justify-center rounded-full ring-offset-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        <Image
          src={avatarSrc || "/assets/images/avatars/ava_1.png"}
          alt={user?.full_name || "User avatar"}
          width={32}
          height={32}
          className="rounded-full"
        />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { mt: 1, backgroundColor: "#FFF", minWidth: 200 },
          },
        }}
      >
        <div className="px-3 py-2" style={{ backgroundColor: "#FFF" }}>
          <p className="text-sm font-medium">
            {user?.full_name || "Signed in"}
          </p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
        <Divider />
        <MenuItem disableRipple>
          <Button
            sx={{ backgroundColor: "#9e8d1a", color: "#FFF", border: "none" }}
            fullWidth
            variant="outlined"
            onClick={handleLogout}
            data-testid="logout-btn"
          >
            Logout
          </Button>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HeaderProfile;
