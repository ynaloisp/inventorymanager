'use client'
import Image from "next/image";
import { Kodchasan } from 'next/font/google';
import { Box, Typography, AppBar, Modal, Stack, TextField, Button, position } from '@mui/material';
import { useState, useEffect } from 'react';
import { doc, collection, getDoc, getDocs, setDoc, deleteDoc, query } from 'firebase/firestore';
import { firestore } from '../firebase';

const kodchasan = Kodchasan({ subsets: ['latin'], weight: ['400', '700'] });

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const applyFilter = (item) => {
    return item.toLowerCase().includes(filter.toLowerCase());
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id, ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={2} className={kodchasan}>
      <AppBar justifyContent="center" sx={{ bgcolor: "#C5DCC2", color: "black", height: "211px", justifyContent: "center", alignItems: "center"}}>
        <Typography variant="h6" fontSize="64px">
          Inventory Manager
        </Typography>
      </AppBar>
      <Modal open={open} onClose={handleClose}>
        <Box borderRadius={3} position="absolute" top="50%" left="50%" width={681} height={399} bgcolor="#5A855F" border="2px solid #5A855F" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%, -50%)" }}>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField label="Add Item" sx={{ border:"133px", width:604, height:133, bgcolor: "white" }} fullWidth value={itemName} onChange={(e) => { setItemName(e.target.value) }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="rounded" sx={{ bgcolor: "white", color: "black" }} onClick={() => { handleClose(); }}>Cancel</Button>
              <Button variant="rounded" sx={{ bgcolor: "white", color: "black" }} onClick={() => { addItem(itemName); setItemName(""); handleClose(); }}>Add</Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="column" spacing={2} justifyContent="center">
        <Button sx={{ width: "355px", height: "76px", bgcolor: "#91B38E", alignItems: "center", borderRadius: 2, boxShadow: 6, color: "white"}} onClick={() => { handleOpen() }}>
          Add Item
        </Button>
        <Box width="355px" height="641px" display="flex" flexDirection="column" bgcolor="#91B38E" sx={{ justifyContent: "center", borderRadius: 2, boxShadow: 6 }} padding={2}>
          <TextField label="Filter Items" value={filter} onChange={handleFilterChange} fullWidth sx={{ width: 304, height: 57, bgcolor: "white", borderRadius: 2, boxShadow: 6}}/>
          <Stack spacing={2} width="100%" padding={2}>
            {
              inventory.filter(({ name }) => {
                return filter.toLowerCase() === "" ? name : name.toLowerCase().includes(filter.toLowerCase());
              })
              .map(({ name, quantity }) => {
                return (
                  <Box key={name} width="304px" height="57px" display="flex" justifyContent="space-between" alignItems="center" bgcolor="#C5DCC2" borderRadius={2} boxShadow={6} padding={2}>
                    <Typography variant="h3" color="#white" sx={{alignItems: "center"}} fontSize="20px">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="h3" textAlign="center" fontSize="20px">
                      {quantity}
                    </Typography>
                  </Box>
                );
              })
            }
          </Stack>
        </Box>
      </Stack>
      <Box width="1362px" height="744px" bgcolor="#91B38E" sx={{ borderRadius: 2, boxShadow: 6, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Stack width="1221px" height="621px" bgcolor="#D3ECDC" sx={{ borderRadius: 2, boxShadow: 6, alignItems: "center" }} spacing={2} overflow="auto" padding={4}>
          {
            inventory.map(({ name, quantity }) => (
              <Box key={name} width="1126px" height="99px" display="flex" sx={{ justifyContent: "space-around", bgcolor: "#C5DCC2", borderRadius: 2, boxShadow: 6 }} padding={2}>
                <Typography variant="h3" color="#white" sx={{alignItems: "center"}} fontSize="20px" padding={2}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" textAlign="center" fontSize="20px" padding={2}>
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2} sx={{justifyContent: "flex-end"}}>
                  <Button variant="contained" onClick={() => { addItem(name) }}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => { removeItem(name) }}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  );
}
