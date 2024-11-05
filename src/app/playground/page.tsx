'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import ImageMouseTrail from '@/components/ui/Mousetrail';
import { NumberInput } from '@/components/ui/NumberInput';
import { PriceWithDiff } from '@/components/ui/PriceWithDiff';

import { Button } from '@/components/ui/Button';
import { Page } from '@/components/Page';
import { WalletComponent } from '@/components/WalletComponent/WalletComponent';
import { ContentWrapper } from '@/components/ui/contents/ContentWrapper';
import { MainHeader } from '@/components/ui/typo/MainHeader';
import { StatusComponent } from '@/components/StatusComponent/StatusComponent';

const images = [
  "https://cache.tonapi.io/imgproxy/D08GmAkG9LwyYrMhxqWBbeAFIwEkwuDTNorO6cF_FAg/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVG5Ndm1QTDM1UmpNRFVUa1JXUGNSazRtNnNTb0VKanVEa01HczlqOWF1UEo.webp",
  "https://cache.tonapi.io/imgproxy/Zy60ibdDQEjPtu42K_3JSH3qao0AtE33R8iucmS4wFo/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZDZMMWYzc1YxZHNmelNGWTNEOUE5Yk1xZDhkWGR3Y3gzZFZScFBHS0trNUU.webp",
  "https://cache.tonapi.io/imgproxy/vJd76i4eSAhRgHntXibB8sXEIO_XUCKNTv51g0a1sZc/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtYjlvTmQ3RmdETUticldyVE5jUThRQXNhY2RNN1hSQmdZaTYyZnc3eWQxZnY.webp",
  "https://cache.tonapi.io/imgproxy/UR_HelNWCGFSbcoFSfC08_P9_QqxU049gI3q6M_TLhs/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtWVg1RGM1ZWtyZW43YUhEQ1FpUTZRWUJ6aWR0akdGV3M0OEZ4NFdXejV5V1I.webp",
  "https://cache.tonapi.io/imgproxy/ATRbXPaqPINJFlbNB_3jg7p4gGpJktjsU0XwTBn7Wmw/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtWVJ5QmhCNFF6UVJZc1JEcFdLU3NQMXZGYU5wUFQ4dmVRZFpVc3JDdkY3V3o.webp",
  "https://cache.tonapi.io/imgproxy/vjXA99l3ulmqKzYUmKSyTMdcxsqFJOLfrgj2jvTNiYc/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtV0VadEdIVXh5QnZxdXJWUHFoQU40Mjd1WG9YVWtzeFRmMVZ1QU1SOWh4U1c.webp",
  "https://cache.tonapi.io/imgproxy/KFO-fowFZUnk4MLJ_ZLh-reQgpK8MpcARAQgnloImaY/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtUDRMZjJHdnhFa3BEekNYTkNra0h2RTM5V1lCeGRoa1NKS1FrZ2lpaFVEd2E.webp",
  "https://cache.tonapi.io/imgproxy/Au4ifpxf0O9ZtaeQE5BDidBsvCC3ivYdvkPla4u3HWM/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtU2c1MmRkaXBuaEhlcW9QUnNtVVdkdUdONnFQMnpVdUY0UFV5cjd4S0dCekc.webp",
  "https://cache.tonapi.io/imgproxy/sMzV2TnZLadTyepEBW1fWxOaJ8epR0MUll3JzPTTPK4/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVEJ5ZEVnRU5Hd3JBbnZvS1F1UXFXaTIzU0FRalJ3N2R0MUQ3WlBuUnhheG8.webp",
  "https://cache.tonapi.io/imgproxy/hIrW1-Y6h6HCAHuFI3slxPquRc2YjOkVNw2Zt2sGPRU/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZFZTY1N3RGM3cXcya1k1N3pUYmdKY2lTYTZuWmRFTjZZQlJqVVVydG1IbkM.webp",
  "https://cache.tonapi.io/imgproxy/sU4AoDviIkLR5UBg3urkCQBH5GEKbMEWQ_wlV_ksXxY/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVUd6QWpYc2I4RzU2OHIyOTFNY2hqUkd3OXBlTEhFNTVkUFp2ZVAxVFBNTjk.webp",
  "https://cache.tonapi.io/imgproxy/n2kvHRmeHiHH8OVyVdTGYmfBd49dQaJ4lx37JIfG6xE/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZkxrYnRtYkxjd0Jpa2hkWEhoQW5ZUUdIZVF2RUJpZXA2Y0VYY0ptbzNVR2M.webp",
  "https://cache.tonapi.io/imgproxy/Wh-JEJhXhvSswSulVRHuMzcMrLIzjPZinwJ0rYErhmc/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVk1Odm9qYVI1RWtSdUhrQjlDa2g5MzhKNktNUWFqd1M3WEcxNDlVTEZ3NEg.webp",
  "https://cache.tonapi.io/imgproxy/WfMMud-bQHwNLXQvulLAXld2JvPMOQvpN1HJgkib1go/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtV2NRUGE1eGMzWXVDTmkxWEhLeWhWNlkzV25kTTczcHVaU1l6cnQ0d1pmc1I.webp",
  "https://cache.tonapi.io/imgproxy/MEg2pimKg7uodfOULjrIhYmArttB6xZqfBss074q5v8/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZVg4VW5TVEZXWUJ5SlFENmNnejFCMzZ2aGo1ZDljQ2E3WHoxVFFHV1JzQlA.webp",
  "https://cache.tonapi.io/imgproxy/nCZBhlhr2jXDMmJlgpm9WCSL4obBBUt6KZ96YP0cgv0/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVDRXTnJqN05GRTN0VXFWaU1MNlpzWGoyTnlMaG1OS1BuQTR2M0pueFZSalc.webp",
  "https://cache.tonapi.io/imgproxy/12MMVkavG4MoqTXb6IEHL-tnFpTeM96QFIn_TAw4gRk/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtUTJvdXpDRWpUajcxTGlzcnppRFVieWpqaDRhMURVV0o5d1RpRGRlYk5IUmQ.webp",
  "https://cache.tonapi.io/imgproxy/TdzmlIY5mZ6KlCVf7yGPLpIELf4U36FVGF95mGqrvuU/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZlFFYWl4ZDNRb1hHbkFndmZtSEptckhSR0t5dVZXSm1SRTUyd01vOXBENE0.webp",
  "https://cache.tonapi.io/imgproxy/qpR75GKMif6ksCONYRZKv3bxzbq0HHsn3Z4TBTh427c/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtYkx0dE00UGZpN3hKVVBpYXpodVFZMWFOMmdvTTNEUDF4UnlISGkzRUh4dUU.webp",
  "https://cache.tonapi.io/imgproxy/24p3Ofc2-pGcHynC01rDItt3UWG3H1UsuyS2xnUulpU/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVFJkc2F6TkU4V1NxWDVBbzdoa1lIUEZ3SFBZU3o4eXdzRkxzRWk5Q0IySDc.webp",
  "https://cache.tonapi.io/imgproxy/-MdBRJqadPYjl7c4vB6yHZCSDDdNg7gXIo-22OquHXo/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtWnBBdzNSV2JUc2Q1NG1tTDNHZUhmWlczRTh1M25oalZuQzJYOXNIUFBrc1k.webp",
  "https://cache.tonapi.io/imgproxy/YOpQxh8pdaVDR7tkVhrblu4tBxg1SXz9d-hbs-Awxrk/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtUkwyZDhDR041SllqOUJpMm5oTjlMNm14SmFWdzk0ajlzTUhmUUo2TTZiY0o.webp",
  "https://cache.tonapi.io/imgproxy/ygOLkomJR1BE9Fk9aSFiNlo0iprBVttAv7bO0P5QsU0/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtWndtdVJhZURBWkN3dlVWaDM1enNnOHdKbjVEUExQVHg5VmVFSE42UW5IWXg.webp",
  "https://cache.tonapi.io/imgproxy/_0_oN8Lh5UMeBQxdxTbtRvdy11L0F6OCzOcrAdoXQxY/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZGpxN1A3c29KNEh6eWd5YXpHTkpiVTY5Y1Azajc1ZFFheGdTRHNRakwyRWI.webp",
  "https://cache.tonapi.io/imgproxy/tQIXJfa97pvmgOIXpWgxLQbJLb29n-sT8G4JtQDdAzA/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZXNjNXRLNTFGOGV1ZjNCRzJzZDIxVmhkM0Z6enZqZVdzdXllTGF4dUcyOVM.webp",
  "https://cache.tonapi.io/imgproxy/JB8BjOqacWB_1vkQbKSchih7qy9cv7CoUeOFQYEKdV4/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZktBR3NZQm9zajI2eEQzdkJYRkc0OGM0d3l6NnR5UTQ0djR1ckoyNFpiRWk.webp",
  "https://cache.tonapi.io/imgproxy/sfwbeQhBuswEqGuEzXhMvu5-XbS7yXb3sNx1jnNfK8A/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtWG1QcFlVOG1qdzR4UkoyclNMdXJvdVZjMXFZVjc5aVV1VFFwYjlKR0djS3Y.webp",
  "https://cache.tonapi.io/imgproxy/Qr0z1FAmJSIE5vB6g4dxDuZ-Gh6NgoWMePq1PTO4VLE/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtYXNTcXhUUlN3YVhLN251bkpkNDh6bW1iQ2pqQlVFTE16bUw5OFQ5emtMS1o.webp",
  "https://cache.tonapi.io/imgproxy/TvYbpazf_0tHkJzKPs6yPklX5vqjEfh0UH9ZLltWq3U/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtYnpuUW9LZHlQcVltbVZZaFBab3NGYUN5d3diZEVWNDk5cWJ4NG92N2NjTWs.webp",
  "https://cache.tonapi.io/imgproxy/BLuvLO-Q-j9kGhIhc38dXmnmfpzG2T5m_PKrvJsywQk/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVEF6dWNDZTJGd1IzeloxaUZOZ1pBVlRrc3oxcndoNjhMTXVUNHBGTWdTang.webp",
  "https://cache.tonapi.io/imgproxy/x4JpRIPyDIWlnlmsnhWSn81ehZ_PC372qwyR3pRGbPA/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVUNpWXJtTlJLQUc1N2luRVZVajQzTkhxWXRNRlBWMmlXeHdwNG1FdkRkelg.webp",
  "https://cache.tonapi.io/imgproxy/i9wCtIEJaqac6662ZSMiE2f9r_FLEhVGTiBobwrIVAI/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVUVycU16ZlVWd1RLTU1ienprMTNzRWl2RG96RVpzVWlva1ozNnhNY2lhOHM.webp",
  "https://cache.tonapi.io/imgproxy/WvaRZ47RW982TW_DzVxFGNEkkflwI2PpyHoEUz0SIq8/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtUHl5THRNNTdtSlo1UWtWQ1FUM0h4VG9BekJaZzZhaHBONGJha3FlMXUzSjg.webp",
  "https://cache.tonapi.io/imgproxy/fHxEvcX9XmeBlUZtkn3d1Prql8JNqDAFoRqeMhhFIOM/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtU1U3UjQ1ZzFzbjlhRTc5MlFWUGd4WmhSbVNvNGJTN2tNaVVMWTQxSnk5YVo.webp",
  "https://cache.tonapi.io/imgproxy/O7yh5oxvpSRk6LNNtKpiO9SCl1LxkgT9AB_-AsbAHv0/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVVdERGFFN0EzWTRGa1dMd2JvM3VlUjQxSk1rQ0FKTHNHcXBBOFBaa1lQWUE.webp",
  "https://cache.tonapi.io/imgproxy/LJfnFl94Be657SWOnNS0Hhvez7VszndH3qME3TQm-og/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtUWdqNUJ1VGdOWjVIdFc3Z2pNMnc1dFB3c29GUUM0RXlFWUdpaEdRaGpQTHM.webp",
  "https://cache.tonapi.io/imgproxy/A33JVSChPOVRQLxXIOTPo2iC07ZyZ3A1GZwWQlAEF8c/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVG9zWXFKa3pKVGdORlJRdGg1TWdabWZ3VzV2cmZ6WGpETkQ3QTJMM3VyTFg.webp",
  "https://cache.tonapi.io/imgproxy/FOhV4uYYFkM7Oydi1YK7wkAl_GVWCgUI0G2Y0l6eMyg/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVWtMQld2VFo0Q3lnbk5MWGhhM0JTUFRKTGkybXRVSE1tcmFnd2NncGZjN00.webp",
  "https://cache.tonapi.io/imgproxy/EvRsNP_UCmVD-QEgiA7a1W5b6EQEgl006xfRAsVeVhI/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtU2VxRGNpS0JwRks0R1phWlpoMkNuRXlYM3NDYVlIcDIzUmZaVUFLN0FYQUg.webp",
  "https://cache.tonapi.io/imgproxy/t0S3yCqO2bldrkjuTx2mhb04o91RX4jJ28D65yJtmYU/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVXZzUDFIYk5SQUs5b29jVWdDYlBRRHI3S3p2cHMxTGN4NEFVbmg5dmh6dzI.webp",
  "https://cache.tonapi.io/imgproxy/NxiWdFE9cpuRim1AXbf114hHdEVmO4OC0drJZVsYh3k/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtWkpCeW1pZFRTcFRuWmJLWkgxRTJ2Y1hQaFpKbXpUczl4ZzdNMXV3ZEpuZmc.webp",
  "https://cache.tonapi.io/imgproxy/Q99OihqtooiYY7grC2lnz2d0RiGZAHNtjOcjOOdBd7E/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtYzFTaURqREsxUm01UUFVZkdkdnRyOGdzRWN6ek02b3RrR2pibUFpYkNiaGE.webp",
  "https://cache.tonapi.io/imgproxy/F7jPSyJyMiZoPjMYQY_t1ywytgqR7SeRJcd3I2W0Ho8/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtUW1DYnRkVVFyVTU1SGtVcjlqV21EODRxM2dSMTRmcnNTMzRuYW9uVlpxY0c.webp",
  "https://cache.tonapi.io/imgproxy/PW_lcDdFH19k-6RsNGQdtxKDvQi_Lki7CpY6GiW9xzE/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtY0dRN2U4YTY0R3JNZEZFWnA3S0VuM2JKM3VlWXBGdldwblFjWDVVSzRTQkY.webp",
  "https://cache.tonapi.io/imgproxy/j_m_6ev1ouEw2UgpDAWmZSXlAWuubJuLno7SCWTT8tA/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtV0xnaGV4bnpSdEFqSkxxMXJGVkd3UVM4dWk4S0NGZGkyc2ZDZFN3QXRtNjQ.webp",
  "https://cache.tonapi.io/imgproxy/PMV-MyCgay6LqcDROCI5E5IYVjHLcrweC9s_KF6IGNo/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtV1o0U2h6QXFSa1hRWkwyZjJWSHF6QTE3UlQ1RW5RSzZ2VXl1NU51b3BXdWY.webp",
  "https://cache.tonapi.io/imgproxy/Z8THicjBD7CuYbcTG62-nbevoegFqFH8Zvvkiw2M1cQ/rs:fill:500:500:1/g:no/aHR0cHM6Ly9zZW5zZS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtV05hS0Y4aXE3Q3VleGoyYUZ0b2lHeDlNQndIQWJXZkJUNmZ6Um5vWEgzVTY.webp",
];
// TODO: Number input requires @number-flow/react and framer-motion. Remove this lib if we're not using it. Or make code spliting and lazy loading.
export default function PlaygroundPage() {
  const [value, setValue] = useState(0);
  const numbers = [124.23, 41.75, 2125.95];
  const diffs = [0.0564, -0.114, 0.0029];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCustomClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numbers.length);
  };

  return (
    <Page>
      <ContentWrapper className="!px-0 !max-w-sm h-full flex flex-col">
        <MainHeader>Sense</MainHeader>
        <WalletComponent />
        {/* MouseTrail effect example */}

        {/* <div className="flex-1 flex items-center justify-center">
          <ImageMouseTrail
            items={images}
            maxNumberOfImages={3}
            distance={5}
            imgClass='w-24 h-24 rounded-lg'
            className='bg-white text-black'
            fadeAnimation={true}
          >
            <article className='relative z-500'>
              <h1 className='xl:text-[7em] sm:text-6xl text-4xl text-center font-semibold text-black drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'>
                ✨ Experience
              </h1>
            </article>
          </ImageMouseTrail>
        </div> */}

        {/* Motion Numbers examples */}
        <div className="flex-1 flex items-center justify-center min-h-[200px]">
          <NumberInput value={value} min={0} max={99} onChange={setValue} />
        </div>
        <>
            <PriceWithDiff value={numbers[currentIndex]} diff={diffs[currentIndex]} />
            <button
              onClick={handleCustomClick}
              className='flex h-11 mt-4 w-fit mx-auto items-center gap-2 rounded-md border bg-primary-foreground px-5 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[98%]'
            >
              <svg className='size-4' strokeLinejoin='round' viewBox='0 0 16 16'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M2.72876 6.42462C3.40596 4.15488 5.51032 2.5 8.00002 2.5C10.0902 2.5 11.9092 3.66566 12.8405 5.38592L13.1975 6.04548L14.5166 5.33138L14.1596 4.67183C12.9767 2.48677 10.6625 1 8.00002 1C5.05453 1 2.53485 2.81872 1.50122 5.39447V3.75V3H0.0012207V3.75V7.17462C0.0012207 7.58883 0.337007 7.92462 0.751221 7.92462H4.17584H4.92584V6.42462H4.17584H2.72876ZM13.2713 9.57538H11.8243H11.0743V8.07538H11.8243H15.2489C15.6631 8.07538 15.9989 8.41117 15.9989 8.82538V12.25V13H14.4989V12.25V10.6053C13.4653 13.1812 10.9456 15 8.00002 15C5.35065 15 3.04619 13.5279 1.85809 11.3605L1.49757 10.7029L2.8129 9.98181L3.17342 10.6395C4.10882 12.3458 5.92017 13.5 8.00002 13.5C10.4897 13.5 12.5941 11.8451 13.2713 9.57538Z'
                  fill='currentColor'
                ></path>
              </svg>
              Shuffle
            </button>
          </>
      </ContentWrapper>
    </Page>
  );
}
