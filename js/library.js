// library.js

// This file is part of OpenAero.

//  OpenAero was originally designed by Ringo Massa and built upon ideas
//  of Jose Luis Aresti, Michael Golan, Alan Cassidy and many others. 

//  OpenAero is Free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.

//  OpenAero is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.

//  You should have received a copy of the GNU General Public License
//  along with OpenAero.  If not, see <http://www.gnu.org/licenses/>.
    
// This file contains sequences which will be available in menu Library

// var library is a JSON Object for the Library Menu
// The Key is the path (Year > Folder > Sequence Name)
// The Value is an OpenAero sequence link (use "File->Save as link" in OpenAero to generate)

var library = {
    '2023 CIVA Unl Free Known':
        'https://openaero.net/?s=hFVubGltaXRlZIdwb3dlcmVkiEZyZWUgS25vd26JQ0lWQYo0MIswjSJAQSIgLDNpZmgzNKd-ICJAQiIgMjQnLDZtNmYsuCAiQEMiIC0sZiwyp2lyZGIsNDguJytgICJARCIgJyyyLmssM2lmLDX_oCJARSIgLeBgaXMsNC4naWJwYigsMzIupyksOCs-j0NJVkGQMjAyMy4xkWdyaWQ6NQ',

    '2023 CIVA Adv Free Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh3Bvd2VyZWSIRnJlZSBLbm93bolDSVZBijMwizCNIkBBIiAtM2gzZiAiQEIiIDI0YTMsMzQgIkBDIiA2Y2YgIkBEIiAxbWY7InwiNDggIkBFIiAyNOIoMyk4LY9DSVZBkDIwMjMuMZFncmlkOjU',

    '2023 CIVA Int Free Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYdwb3dlcmVkiEZyZWUgS25vd26JQ0lWQYozMIswjSJAQSIg4OA2cy5pazI0LSAiQEIiIGRoOCAiQEMiIP4sNHBiICJARCIgfjMsNGljLjEr_6AiQEUiIHFvj0NJVkGQMjAyMy4xkWdyaWQ6NQ',

    '2023 CIVA-Glider Unl Free Known':
        'https://openaero.net/?s=hFVubGltaXRlZIYyMDIzh2dsaWRlcohGcmVlIEtub3duiUNJVkGKMTWLMI0iQEEiIDQsM2lmLSAiQEIiIG8yNC0gIkBDIiAtaDQtICJARCIgLSw0aXRhICJARSIgLSwyeS2PQ0lWQZAyMDIzLjGRZ3JpZDo1',

    '2023 CIVA-Glider Adv Free Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh2dsaWRlcohGcmVlIEtub3duiUNJVkGKMTWLMI0iQEEiIDQ4LDIgIkBCIiBtMjQgIkBDIiBvtCAiQEQiIDFqMSAiQEUiIC0sNGlycC1-j0NJVkGQMjAyMy4xkWdyaWQ6NQ',

    '2023 IAC Primary Known':
        'https://openaero.net/?s=hFByaW1hcnmGMjAyM4dwb3dlcmVkiEtub3duiUlBQ4o1izCNZCBpdmA2c66nIC5jLicyYCvgICgtMTUsMTMpIG8gNSUgMmorIDGPSUFDkDIwMjIuMi41kUI',

    '2023 IAC Sportsman Known':
        'https://openaero.net/?s=hFNwb3J0c21hboYyMDIzh3Bvd2VyZWSIS25vd26JSUFDijEwizCNbyBkaCjgKa6nq6ur_iAoLTIsMCkgK2uurqcyNK6nIGBtMiBgMX4gKC00LDApIDUlIP4yaiAoLTIsMTApIGQg_itpdjVzJyBiLic0IK5jLjIuJ49JQUOQMjAyMi4yLjWRQg',

    '2023 IAC Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYdwb3dlcmVkiEtub3duiUlBQ4oxNYswjEludGVybWVkaWF0ZSBLbm93bo1xbyDgK3YuNF4gaXbgNnOuri4nIGIuJzQgMSUgfqcycmMrYCAoLTQssikgYCtvZiA0JSDgbbItICgtOCwwKSCyJSAtMmot4OAgLTI0IDIlIODg4ODg4GAyaWFjKOAyKSvg4GAgZGiuLicgKC0yNiwwKSB-p2uuMjQuj0lBQ5AyMDIyLjIuNZFC',

    '2023 IAC Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2VkhjIwMjOHcG93ZXJlZIhLbm93bolJQUOKMjWNMjRkaCgnKS4nMmYuK34gL_6rq66ubigsNDguKacsMjSnrSAoMTMsMCkgLTVpc66urq6uJ2liLDgtICgtMiwwKSAtaWRxLSAxNSUgLeBhLDYtICg3LDApIC0zLmKurjMupyvgYCA0JSBvsiAoLTYsMCkg_mAyp2uuri6nsq6nICg1LDApIOBtpzMyJzs2Zi1-ICgtMTIsMCkgLTNqMy0-j0lBQ5AyMDIyLjIuNZFC',

    '2023 IAC Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIYyMDIzh3Bvd2VyZWSIS25vd26JSUFDijQwizCNMmlmcnAotCknMy6nLDj-IC4sOHRhM2auLqcgKDIsMCkgLzMucOIoLiw1Zq4pLiw0pywyp34g4GA1czsyaWauLmlycCcyNC6nLDEr4OAgL-ArM2oxNS0grXBiLqc1riCrq6szaWYnaC4nMy6nIODgsmFjKDZpZuApJzinLDUt4ODgIDglIC3gYGlmYTEsOf6PSUFDkDIwMjIuMi41kUI',

    '2023 IAC-Glider Primary Known':
        'https://openaero.net/?s=hFByaW1hcnmHZ2xpZGVyiEtub3duiUlBQ4o1jf5pZC6rfiAoMiwwKSCrb2qrq_4gNiUgYCszaitgICcxfiBgKy5qd66uLitgIC0xJSBvj0lBQ5AyMDIzLjGRQg',

    '2023 IAC-Glider Sportsman Known':
        'https://openaero.net/?s=hFNwb3J0c21hbodnbGlkZXKIS25vd26JSUFDijE1izCNZCcg_ml2JzZzri4rIG8gMnJkYq4u_iAuYy4sMq6uLid-IDMlIODgK29q_iB-aqsrfiAnMf6PSUFDkDIwMjIuMi41kUI',

    '2023 IAC-Glider Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYdnbGlkZXKIS25vd26JSUFDijE1izCNc2lycKcy_iAyLSAxNCUgLWEg4HJ5IP4nMqd0Lic0Lif-ICsnaCw0LicrfiAxMCUgYCvg4OBgMmByYyvg4GAgKDEsMCkgLTIlIP6rKycyLnJkYq6urq6uK-Dg4CA2JSBtLDKPSUFDkDIwMjIuMi41kUI',

    '2023 IAC-Glider Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh2dsaWRlcohLbm93bolJQUOKMjWLMI00OC0gLXSurq6nIFstMTIsMF0gK3JwKDI0KSv-ICgtMiwwKSCndGGupyvg4GAgfiwycmRiLn4gri6ncCgyKa6nfiBvMjQsMiB-qydoNC4g4GAr4HBiLDQnK-AgtJAyMDIyLjIuNZFC',

    '2023 IAC-Glider Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIdnbGlkZXKIS25vd26JSUFDijI1izCNaWSnMjSnLSAtMnJjLSAoLTcsMTIpIC0yYzJpZi4gMjQtIC2ndGE0Licr4CBirjNpZiA0JSBvMjQsMiAvpzQuaCt-IDFqbzGPSUFDkDIwMjIuMi41kUI',

    '2023 NZAC Primary Known':
        'https://openaero.net/?s=hFByaW1hcnkgh3Bvd2VyZWSIS25vd26JMjAyMi8yMyBOWkFDijOMTlpBQyBQcmltYXJ5IEtub3dujTUlIGQg_ml2LnMuJ6t-IC0xJSCuri6nY66uLDKuritgIDYlIG_-IH6rK64uJ2iurqsrfiCuLicxq_6PTlpBQ5AyMDIyLjEuN5FC',

    '2023 NZAC Recreational Known':
        'https://openaero.net/?s=hFJlY3JlYXRpb25hbIdwb3dlcmVkiEtub3duIIkyMDIyLzIzIE5aQUOKNo0nbTIgKC0xOCwwKSA4JSD-Mmr-IP4raXanc6f-IH4rJ2iuJyt-IP5gYi4nICgtNiwwKSAtMiUgYGOuricyK-AgLTElIOArbytgICcxYH6PTlpBQ5AyMDIyLjEuN5FC',

    '2023 NZAC Sports Known':
        'https://openaero.net/?s=hFNwb3J0c4dwb3dlcmVkiEtub3duIIkyMDIyLzIzIE5aQUOKMTCNYi6nIGQgaXY2c66nqyt-IP6rq2syNK6uLicgbTKrK_4gNz4gOSUgMmogp2lyYzJ-IDEzJSBgMjRhK2AgbyBop_4gMY9OWkFDkDIwMjIuMS44kUI',

    '2023 NZAC Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYdwb3dlcmVkiEtub3duIIkyMDIyLzIzIE5aQUOKMTWNbTGtLf-gsSUgLTJqLSAtMmlyYzI0_iAoLTgsMjEpIDI0aWFvK2AgMmZpcDT-XiB-KzVzrq4uaXJwMis-IDEwJSAuMmGrfiBkaK6uq6srfiCrLDhiLDSuLicr4GAgYWMoMjQpMo9OWkFDkDIwMjIuMS44kUI',

    '2023 NZAC Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2VkhU5aQUMgTmF0aW9uYWxzhjIwMjIvMjOHcG93ZXJlZIhLbm93bolOWkFDijI1jE5PVEUgWS1CT1ggRU5UUlmNZWogL6suNHBuKGYuKSw4Lq1eIDclIOBgLeDgNWlzridpYuBgMjRgK-BgPiAyPiCurmlycGatra2tLX4gMTIlIC3g4ODg4GBpY-A0LDPg4OBgLeAg4C0zajMtfiCtcGKuLDMuK-BgPiCnLDMuaDNmpyv-IP4rb7QrfiAyPiAubTOnLDM0Jy0gKDAsMTQpIC0xaWFjKCw0OCm4j05aQUOQMjAyMi4xLjiRQg',

    '2023 NZAC Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIVOWkFDIE5hdGlvbmFsc4YyMDIyLzIzh3Bvd2VyZWSIS25vd26JTlpBQ4o0MI1-Ky4nMiwyZnpipzQ4rietrf4gLSwzZmKuri41rq4gMSUgNj4gOWFjKDZpZmApsi1gIC2uLqdwbignM2anOzWuKSwyNK0t_iDgYC3g4DVpcycsMmaurq6uLmliMy0gMyUgLS4xLmlycDJmOzQ4LX4gMTMlIODgLTJqbzEtID4g_q0nLDh0YWAsM6cr4D4gJzUnaC4zaWYuK34g_itvuCv-j05aQUOQMjAyMi4xLjiRQg',

    '2022 CIVA Unl Free Known':
        'https://openaero.net/?s=hFVubGltaXRlZIVDSVZBhjIwMjKHcG93ZXJlZIhQcm9ncmFtbWUxiUNJVkGKNDCLMIxDSVZBIDIwMjIgVW5saW1pdGVkIEZyZWUgS25vd24gZmlndXJlc40iQEEiIDIsMmZ6YjQ4LSAoMTMsMCkgIkBCIiAifCI0OzNpZmRoKDQppzVmICgwLLEpICJAQyIgsmFjKDJmKTMsMzQtICgwLDcpICJARCIgLDV0YeAzICgwLDEzKSAiQEUiIC4sMjQucG4oInwiNWY7MykyLi2PQ0lWQZAyMDIyLjEuMZFncmlkOjU',

    '2022 CIVA Adv Free Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh3Bvd2VyZWSIUHJvZ3JhbW1lMYlDSVZBijMwizCNIkBBIiDg4GArNmZpYycyNODg4C0gKDAsNSkgMSUgIkBCIiA2c2lycCwzMixm4GB-ICgxNiwwKSAiQEMiICw4J-Io4DIpK2AgKDE2LDApICJARCIgLDJwbigssqcpICixLDApICJARSIgNGgyZo9DSVZBkDIwMjEuMS4xMJFncmlkOjU',

    '2022 CIVA Yak52 Free Known':
        'https://openaero.net/?s=hFlhazUyhjIwMjKHcG93ZXJlZIhQcm9ncmFtbWUxiUNJVkGKMzCLMIxDSVZBIFBvd2VyIEludC1ZNTIgRnJlZSBLbm93biBmaWd1cmVzIDIwMjKNIkBBIiBwKLIpICg4LDApICJAQiIgNGg4ICgwLLEpICJAQyIgbTMyICgwLDkpICJARCIgb2YgKDAsMSkgIkBFIiA2YY9DSVZBkDIwMjEuMS4xMJFncmlkOjU',

    '2022 CIVA Int Free Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYYyMDIyh3Bvd2VyZWSIUHJvZ3JhbW1lMYlDSVZBijMwizCMQ0lWQSBQb3dlciBJbnQtWTUyIEZyZWUgS25vd24gZmlndXJlcyAyMDIyjSJAQSIgcCiyKSAoOCwwKSAiQEIiIDRoOCAoMCyxKSAiQEMiIG0zMiAoMCw5KSAiQEQiIG9mICgwLDEpICJARSIgNmGPQ0lWQZAyMDIxLjEuMTCRZ3JpZDo1',

    '2022 CIVA-Glider Unl Free Known':
        'https://openaero.net/?s=hFVubGltaXRlZIdnbGlkZXKIRnJlZSBLbm93bolDSVZBijE1izCMQ0lWQSBHbGlkZXIgVW5saW1pdGVkIEZyZWUgS25vd24gZmlndXJlcyAyMDIyjSJAQSIgNCwzZi0gKDAsMikgIkBCIiAtMWpvNSAoMCwxMCkgIkBDIiA0aCAoMCwxMCkgIkBEIiAtLml0YSAoOSwwKSAiQEUiIG8yZiwyj0NJVkGQMjAyMS4xLjEwkWdyaWQ6NQ',

    '2022 CIVA-Glider Adv Free Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh2dsaWRlcohGcmVlIEtub3duiUNJVkGKMTWLMIxDSVZBIEdsaWRlciBBZHZhbmNlZCBGcmVlIEtub3duIGZpZ3VyZXMgMjAyMo0iQEEiIHAoMjQpICgwLDEwKSAiQEIiIGRiLSAoNSwwKSAiQEMiIC10NCAoMCw2KSAiQEQiIGg0ICgwLDE0KSAiQEUiIDJnj0NJVkGQMjAyMS4xLjEwkWdyaWQ6NQ',

    '2022 AAC Graduate Known':
        'https://openaero.net/?s=PHRlYW0-QVVTPC8-PGNhdGVnb3J5PkdyYWR1YXRlPC8-PGNsYXNzPnBvd2VyZWQ8Lz48cHJvZ3JhbT5Lbm93bjwvPjxydWxlcz5BQUM8Lz48cG9zaXRpb25pbmc-MTA8Lz48bm90ZXM-QUFDIEdyYWR1YXRlIEtub3duIDIwMjI8Lz48c2VxdWVuY2VfdGV4dD5vICg2LDApIGggKC0yOSw4KSBtMiAoMTAsMCkgYCtpdi5zLiAoMiwwKSBjLicsMicnICgtMTMsMCkgM2ogKDAsMSkgaiAoMTAsMCkgMTwvPjxsb2dvPkFBQzwvPjxvYV92ZXJzaW9uPjIwMjIuMS41PC8-PGRlZmF1bHRfdmlldz5CPC8-',

    '2022 AAC Sportsman Known':
        'https://openaero.net/?s=PHRlYW0-QVVTPC8-PGNhdGVnb3J5PlNwb3J0c21hbjwvPjxjbGFzcz5wb3dlcmVkPC8-PHByb2dyYW0-S25vd248Lz48cnVsZXM-QUFDPC8-PHBvc2l0aW9uaW5nPjE1PC8-PG5vdGVzPkFBQyBTcG9ydHNtYW4gS25vd24gMjAyMjwvPjxzZXF1ZW5jZV90ZXh0PmInJyAoMTQsMCkgYy4uLi4nJywyICgtMSwwKSBvICgtNywwKSBoLi4gKDYsMCkgZCAoNSwwKSBpdi42cy4gKC0yNywzKSAsMmcgKDMwLDgpIGogKDAsMikgM2ogKC00LDApIDIyPC8-PGxvZ28-QUFDPC8-PG9hX3ZlcnNpb24-MjAyMi4xLjU8Lz48ZGVmYXVsdF92aWV3PkI8Lz4',

    '2022 BAeA Club Known':
        'https://openaero.net/?s=hENsdWKGMjAyModwb3dlcmVkiEtub3duiUJBZUGKMTCLMI1vIC0yJSBjMq6uLiAyPiBoqysgMmogMY9CQWVBkDIwMjIuMS43kUI',

    '2022 BAeA Sports Known':
        'https://openaero.net/?s=hFNwb3J0c4dwb3dlcmVkiEtub3duiUJBZUGKMTWLMI1x4OAgaK4nqyv-IDJnICgzLDApIGl24DVzrierq6sgbTIgLTIlIH4zaivg4CAoLTksMTcpIODg4ODgYGOnMuBgfiBtMiAoLTEwLDE0KSAyaiAoNCwwKSAxj0JBZUGQMjAyMi4xLjeRQg',

    '2022 France Espoirs connu':
        'https://openaero.net/?s=hEVzcG9pcnOFMjAyModwb3dlcmVkiGNvbm51iUZyYW5jZYoxMIswjENvbm51IEVzcG9pciAyMDIyjWVqYSD-aXY1cyBkaK6urv4gcGIgbTIgKDEsMjEpIP7gYLL-ICJCcmVhayIg_m2tLX4gMTklIP4tMmot4CAoMCw4KSAtNiAoLTIsMCkg4GDjKK4upzKupykupzLg4GCPRkZBdm9sdGlnZZAyMDIyLjIuNJFCkjE',

    '2022 France Desavois/promotion connu':
        'https://openaero.net/?s=hERlc2F2b2lzL3Byb21vdGlvboUyMDIyh3Bvd2VyZWSIY29ubnWJRnJhbmNlijE1izCMQ29ubnUgUHJvbW90aW9uIDIwMjKNZWogdjQtICgwLDApIC1pdmlzrqcgKC0xMCwwKSBrri6nLSAiQnJlYWsiIC1kaK6urS3-IC2udK6upyv-IDM-IDI0aK6uLqcgbTEsMjQgKC02LDApIDJmZyAoNywwKSB-q6syam8yj0ZGQXZvbHRpZ2WQMjAyMi4yLjSRQpIx',

    '2022 France National_2 connu 1':
        'https://openaero.net/?s=hE5hdGlvbmFsXzKFTrAxIC2GMjAyModwb3dlcmVkiGNvbm51iUZyYW5jZYoyMIswjENvbm51IE6wMSAtIDIwMjKNdjT-XiD-aXY1cz4gMmRori6nLSAoLTgsNSkgLTRoq35eIP6rqysnLDRgcnAyK34gKLEsMCkgIkJyZWFrIiBkZiAxNyUg4GBhLSD-rS3g4G0sMi0gKDcsMTQpIDMlIH4tMmpvMTUr4GAg_jM0YCwz4Ct-IH4sNKdiriw0rqcrIP5vMf6PRkZBdm9sdGlnZZAyMDIyLjIuNJFCkjE',

    '2022 France National_2 connu 2':
        'https://openaero.net/?s=hE5hdGlvbmFsXzKFTrAyIC2GMjAyModwb3dlcmVkiGNvbm51iUZyYW5jZYoyMIswjENvbm51IE6wMiAtIDIwMjKNLSwifCIyaXQsNC3-XiD-LWl2NWlzrj4gND4gOWOuJy0gKDAsNykgIkJyZWFrIiAtYCw0p2KuLi0gLa6uJ22yIDNqb2kzICg4LDApIH4rpzJmp3Surq4up6v-IGRiMjQuICgzLDIxKSAxbTM0LDMtIDI-IC0yaWY7tI9GRkF2b2x0aWdlkDIwMjIuMi40kUKSMQ',

    '2022 France Doret/excellence connu 1':
        'https://openaero.net/?s=gEFMTIFGUkGCU0ODRkeERG9yZXQvZXhjZWxsZW5jZYdwb3dlcmVkiGNvbm51iUZyYW5jZYozNYswjENPTk5VIDEuMjKNLDV0YTMuPiAyLGZyYzQsMy0gKC05LDE4KSAtsm0yZiw2K-AgKC0xLDIpIDRqMiAsNOIoMzQpLT4gKC05LLEpIOBgLeA1aXMsInwiNC4naW4oLqc0pywzri4nKa6uICg4LLEpILJraWYsMiCnM2lmLminNK4gKDgsMCkgMzJtNyw1LY9GRkF2b2x0aWdlkDIwMjIuMi40kUI',

    '2022 France Doret/excellence connu 2':
        'https://openaero.net/?s=gEFMTIFGUkGCU0ODRkeERG9yZXQvZXhjZWxsZW5jZYVDSEFNQkxFWYYwNi8yModwb3dlcmVkiGNvbm51iUZyYW5jZYozNYswjENPTk5VIDIuMjKNZWogpywzZidycDQsNS0gLTRqMi0gLacsNDh0YTYuICgtNCw4KSA44iinKTMgNXM7NGlycDJmLDl-IDFkaC5pZi6nICgtMTAsMTIpIDQsNWRiMmlmLiAoMCwyKSAxcnA4LDcgKDAsMjMpIDQ4bTM0LDOPRkZBdm9sdGlnZZAyMDIyLjIuNJFC',

    '2022 IAC Primary Known':
        'https://openaero.net/?s=hFByaW1hcnmGMjAyModwb3dlcmVkiEtub3duiUlBQ4o1izCNZCBpdmA2c66nIC5jLicyYCvgICgtOCwxNCkgbyAyaisgMY9JQUOQMjAyMi4xLjeRQg',

    '2022 IAC Sportsman Known':
        'https://openaero.net/?s=hFNwb3J0c21hboYyMDIyh3Bvd2VyZWSIS25vd26JSUFDijEwizCNYi6nIGQgaXY2c66nqyt-IP6rq2syNK6uLicgbTKrK_4gNz4gOSUgMmogp2lyYzJ-IDEzJSBgMjRhK2AgbyBop_4gMY9JQUOQMjAyMi4xLjeRQg',

    '2022 IAC Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYYyMDIyh3Bvd2VyZWSIS25vd26JSUFDijE1izCNbTGtLSCxJSAtMmotIC0yaXJjMjT-ICgtOCwyMSkgMjRpYW8rYCAyZmlwNP5eIH4rNXOuri5pcnAyKz4gMTAlIC4yYat-IGRorq6rqyt-IKssOGIsNK4uJyvgYCBhYygyNCkyj0lBQ5AyMDIyLjEuN5FC',

    '2022 IAC Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2VkhjIwMjKHcG93ZXJlZIhLbm93bolJQUOKMjWMTk9URSBZLUJPWCBFTlRSWY1laiAvqy40cG4oZi4pLDgurV4gNyUg4GAt4OA1aXOuJ2li4GAyNGAr4GA-IDI-IK6uaXJwZq2tra0tfiAxMiUgLeDg4ODgYGlj4DQsM-Dg4GAt4CDgLTNqMy1-IK1wYq4sMy4r4GA-IKcsMy5oM2anK_4g_itvtCt-IDI-IC5tM6csMzQnLSAoMCwxNCkgLTFpYWMoLDQ4KbiPSUFDkDIwMjIuMS43kUI',

    '2022 IAC Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIYyMDIyh3Bvd2VyZWSIS25vd26JSUFDijQwjX4rLicyLDJmemKnNDiuJ62t_iAtLDNmYq6uLjWuriAxJSA2PiA5YWMoNmlmYCmyLWAgLa4up3BuKCczZqc7Na4pLDI0rS3-IOBgLeDgNWlzJywyZq6urq4uaWIzLSAzJSAtLjEuaXJwMmY7NDgtfiAxMyUg4OAtMmpvMS0gPiD-rScsOHRhYCwzpyvgPiAnNSdoLjNpZi4rfiD-K2-4K_6PSUFDkDIwMjIuMS43kUI',

    '2022 IAC-Glider Sportsman Known':
        'https://openaero.net/?s=hFNwb3J0c21hboYyMDIyh2dsaWRlcohLbm93bolJQUOKMTWLMIxHTElERVIgS05PV06NZCBpdjZzrqt-IDQlIODg4GAy4HJjK-AgMiUgMSDgYCtvaqurfiCrait-IOBiIGgup6t-IG-QMjAyMi4xLjeRQg',

    '2022 IAC-Glider Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYYyMDIyh2dsaWRlcohLbm93bolJQUOKMTWLMIxHTElERVIgS05PV06NOCUgMmErYCAoLTQsMCkgMiUgLDJnK2AgMyUgYCtpdmBzri4gKydoLierfiArp2IufiDgK29qK_4g_mqrfiAuMiwy_iBjpywyNK6uJyBvkDIwMjIuMS43kUI',

    '2022 IAC-Glider Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2VkhjIwMjKHZ2xpZGVyiEtub3duiUlBQ4oyNYswjEdMSURFUiBLTk9XTo0xIC8yZyerq_4gNnOuaUJiKODgYCmuLqsr_iBwKDI0Ka4g4OAraXRhLqcr4ODgIOBgK2RiLf4gMj4gLTEtIC8tdC40LisgPiBoNCcgrqdtMo9JQUOQMjAyMi4xLjeRQg',

    '2022 IAC-Glider Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIYyMDIyh2dsaWRlcohLbm93bolJQUOKMjWLMIxHTElERVIgS05PV06NNCUgMmZhIDMlIG8yZiwyIDMlIGArLDI0dC4nq34gNCwzZi0gMyUgLTFqbzUrIDRoIDYlIODg4OBgcmMt4GAgLXRhIDEsMi2PSUFDkDIwMjIuMS43kUI',

    '2022 NZAC Primary Known':
        'https://openaero.net/?s=hFByaW1hcnkgh3Bvd2VyZWSIS25vd26JMjAyMS8yMDIyIE5aQUOKM401JSBkIP5pdi5zLierfiAtMSUgrq4up2Ouriwyrq4rYCA2JSBv_iB-qyuuLidorq6rK34gri4nMav-j05aQUOQMjAyMS4xLjWRQg',

    '2022 NZAC Recreational Known':
        'https://openaero.net/?s=hFJlY3JlYXRpb25hbIdwb3dlcmVkiEtub3duIIkyMDIxLzIwMjIgTlpBQ4o2jSdtMiAoLTE4LDApIDglIP4yav4g_itpdqdzp_4gfisnaK4nK34g_mBiLicgKC02LDApIC0yJSBgY66uJzIr4CAtMSUg4CtvK2AgJzFgfo9OWkFDkDIwMjEuMS41kUI',

    '2022 NZAC Sports Known':
        'https://openaero.net/?s=hFNwb3J0c4dwb3dlcmVkiEtub3duiTIwMjEvMjAyMiBOWkFDijEwizCNNCUgbyA0JSCuYy4sMjSuLicrYCAoLTEwLDApIDIlIK6ubTKrqyD-aXaup3Ouq34gKC0yLDApIH6rq6urLqdrrqcyri4nq6sgfqurq6suaK4uqyt-IDIlIH6rYi4r_iAxMiUgYCvg4OAy4HJjK-DgIC6nMat-ICgxLDApIDMlIH4zao9OWkFDkDIwMjEuMS41kUI',

    '2022 NZAC Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYdwb3dlcmVkiEtub3duiTIwMjEvMjAyMiBOWkFDijE1izCNcChmKSt-IC9-K3YuJzQuKyA-IH7g4DVzrq6uJ2lrIDglIDJpY-Dg4OBgIDklIP4yaiAxIDUlIKcyYSD-aDQuICssNGL-PiBkaK6uJ6urqyD-MjRnIDFqMY9OWkFDkDIwMjEuMS41kUI',

    '2022 NZAC Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh3Bvd2VyZWSIS25vd26JMjAyMS8yMDIyIE5aQUOKMjWLMIxDcm9zcy1Cb3ggRW50cnmNZWogL34rLqc0p3JwKCwxKSczLqcsMzQrYCAnLDgnaK4uM2auLierKyAoMiwwKSB-pzQsM-B3Mi0gLTFpcK1-ICgyLDApIC0uJ2lzrq6uLidpbigupywyZq4nKa6uri4gMjR5Lqc4IH4rNHBiLicyJ6urK34-IK4uJzI0bbInLGYgM2pvM49OWkFDkDIwMjEuMS41kUI',

    '2022 NZAC Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIdwb3dlcmVkiEtub3duiTIwMjEvMjAyMiBOWkFDijQwizCNMacsOW2yJyw2aWarfiBbLTYsMF0g4G4orq4uNmlmrq6urqcprq4up7Kuri6nrS1-IH4taW85Lf4g_q0tpzGurq4uJ2liLDM0YC1eIH4tpzVpc6csMq6uaXJwJzNmLiwzNOAtPiAv4C0zam8xNSB0YTNmLqd-PiDgKzMncGInNKcsMqerqyt-IKsrLqc0pywzrmRoKCc0pymuLic1Zq4up6v-IKdhYygyaWYpuK2PTlpBQ5AyMDIxLjEuNZFC',

    '2022 VINK Club Known':
        'https://openaero.net/?s=hENsdWKGMjAyModwb3dlcmVkiEtub3duiVZJTkuKMTCLMI1vIC0yJSBjMq6uLiAyPiBoqysgMmogMY9WSU5LkDIwMjIuMS43kUI',

    '2022 VINK Sports Known':
        'https://openaero.net/?s=hFNwb3J0c4VET05BQ4YyMDIyh3Bvd2VyZWSIS25vd26JVklOS4oxNYswjXHg4CBoricgND4gKzJnIGl24DVzrierq6sgbTL-IC0yJSB-M2or4OAgKDIsMTApIGlnrjKuIC0xJSBtMqsrfiA5JSA2PiAyaiAxj1ZJTkuQMjAyMi4xLjeRQg',

    '2021 CIVA Unl Free Known':
        'https://openaero.net/?s=hFVubGltaXRlZIdwb3dlcmVkiFByb2dyYW1tZTGJQ0lWQYo0MIswjSJAQSIgLDNpZi5ycCgssikzLDM0ICJAQiIgLjFuKOAsNWlmLDMnKSctICJAQyIgLS4sM3RhM2YgIkBEIiAtMmpvMS0gIkBFIiA0OGRoKDQpNWaPQ0lWQZAyMDIwLjEuMTCRZ3JpZDo1',

    '2021 CIVA Adv Free Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh3Bvd2VyZWSIUHJvZ3JhbW1lMYlDSVZBijMwizCNIkBBIiAyZGgyNCAiQEIiIG0sMzI7ZiAiQEMiIDJwbigssqcpMjQtICJARCIgOHDiKDIpICJARSIgLDI0Z2AxJ49DSVZBkDIwMjAuMS4xMJFncmlkOjU',

    '2021 CIVA Yak52 Free Known':
        'https://openaero.net/?s=hFlhazUyh3Bvd2VyZWSIUHJvZ3JhbW1lMYlDSVZBijMwizCNIkBBIiA1c2lycK4nLDI0LGYgIkBCIiBtsi0gIkBDIiA0aCAiQEQiIDI0dCAiQEUiIC0xajEtj0NJVkGQMjAyMC4xLjEwkWdyaWQ6NQ',

    '2021 CIVA Int Free Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYdwb3dlcmVkiFByb2dyYW1tZTGJQ0lWQYozMIswjSJAQSIgNXNpcnCuJywyNCxmICJAQiIgbbItICJAQyIgNGggIkBEIiAyNHQgIkBFIiAtMWoxLY9DSVZBkDIwMjAuMS4xMJFncmlkOjU',

    '2021 CIVA-Glider Unl Free Known':
        'https://openaero.net/?s=hFVubGltaXRlZIdnbGlkZXKIRnJlZSBLbm93bolDSVZBijE1izCNIkBBIiBpZDJmLDIgIkBCIiBvZiAiQEMiIGKuMmlmICJARCIgaXRhNCAiQEUiIDFqbzGPQ0lWQZAyMDE5LjIuNJFncmlkOjU',

    '2021 CIVA-Glider Adv Free Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh2dsaWRlcohGcmVlIEtub3duiUNJVkGKMTWLMI0iQEEiIDJhMi0gIkBCIiAtMjRxICJAQyIgaXRhNCAiQEQiIGKuNCAiQEUiIG-yj0NJVkGQMjAxOS4yLjSRZ3JpZDo1',

    '2021 AAC Graduate Known':
        'https://openaero.net/?s=hEdyYWR1YXRlhjIwMjGHcG93ZXJlZIhLbm93bolBQUOKMIswjW8gKDgsMCkgaCAoLTI3LDgpICwycmMgKDIsOSkgZCAoMTAsMCkgaXYuJzZzricgKC0zNCwwKSBtMiAoMzAssSkgaiAzaiAoLTQsMCkgMY9BQUOQMjAyMS4xLjWRQg',

    '2021 AAC Sportsman Known':
        'https://openaero.net/?s=hFNwb3J0c21hboYyMDIxh3Bvd2VyZWSIS25vd26JQUFDijE1izCNZWogaCc0pyAoNywwKSAycmMgKC0yNywxNykgbTIgKDksMCkgaXancy4gKDE4LDApIGBrLicsMqcgKC0yLDYpIGKnICgtsSwwKSBjri6nMiAoMSwwKSBvICg3LDApIDJqICgtsSwwKSCyj0FBQ5AyMDIxLjEuNZFC',

    '2021 BAeA Club Known':
        'https://openaero.net/?s=hENsdWKGMjAyMYdwb3dlcmVkiEtub3duiUJBZUGKMTCLMI1vIC0yJSBjMq6uLiAyPiBoqysgMmogMY9CQWVBkDIwMjEuMS40kUI',

    '2021 BAeA Sports Known':
        'https://openaero.net/?s=hFNwb3J0c4dwb3dlcmVkiEtub3duiUJBZUGKMTWLMI0uMnJjKyB-aK4uJyAyPiBvIG0yICgtsSwxNCkgMmogZCBpdmA2c66n_iAtMiUgMj4gb2qrqyAoNyw4KSBgKzNqKyAtMSUgYzKurqePQkFlQZAyMDIxLjEuNJFC',

    '2021 France Espoirs connu':
        'https://openaero.net/?s=hEVzcG9pcnOGMjAyMYdwb3dlcmVkiGNvbm51iUZyYW5jZYoxMIswjWVkIG0yIGl2ri5zrqf-IDJ0ri6nq34gIkJSRUFLIiDgYCtwYq4up34gbS0gKDMsMTgpIC2yLSA5JSBgLTJqLSAtMiwxIDYlIC5jLqcyricr4GAgKC0yLDApIG-PRkZBdm9sdGlnZZAyMDIxLjEuMZFC',

    '2021 France Desavois/promotion connu':
        'https://openaero.net/?s=hERlc2F2b2lzL3Byb21vdGlvboYyMDIxh3Bvd2VyZWSIY29ubnWJRnJhbmNlijE1izCNLWl2aXMtIC0yZGiuricgMmguIK4nbWYtICgtNCwxOCkgLTIsNDgtIDEyJSDgYC0yajItYCAiQlJFQUsiIC_gLWIupzQuICc0aKsgKC0yLDApIG8xj0ZGQXZvbHRpZ2WQMjAyMS4xLjGRQg',

    '2021 France National_2 connu 1':
        'https://openaero.net/?s=hE5hdGlvbmFsXzKFQ29ubnUgIzGGMjAyMYdwb3dlcmVkiGNvbm51iUZyYW5jZYoyMIswjWVkIC3g4GByea6uLiDgK3YuK34gKC0yLDApIGl2YDdzrq4gKC0xLDEpIDJwYq4nOC4nK-BgICJCUkVBSyIgLm01LDMgKDI1LDApIC0xJSCrM2pvaTOrq6urqyt-ICgtOSw2KSBoJzQuK34-IDEwJSDgNDjgdGAgKC0zLDApIKe0Y66uNDiupyAuJ21mOzI0ICgtMSyyKSAyZzEnj0ZGQXZvbHRpZ2WQMjAyMS4xLjGRQg',

    '2021 France National_2 connu 2':
        'https://openaero.net/?s=hE5hdGlvbmFsXzKFQ29ubnUgIzKGMjAyMYdwb3dlcmVkiGNvbm51iUZyYW5jZYoyMIswjWVqIC84J2uuJzKuLSAtbSAoLTcsMTUpIP4uJzKuaWeuJyt-IC8rMjRopzSnICJCUkVBSyIgYq4nOCvgYCDg4OMorq4upzI0pymuJzQ4K-DgYCDgK3JwMiAosSwxNykgMTAlIOAr4ODg4DJm4GByYyvg4GAgrq4nbTI0LDQ4LSAoNywxOCkgra0zam8zra2tfiAtMmlmj0ZGQXZvbHRpZ2WQMjAyMS4xLjGRQg',

    '2021 France Doret/excellence connu 1':
        'https://openaero.net/?s=hERvcmV0L2V4Y2VsbGVuY2WFQ29ubnUgTrAxhjIwMjGHcG93ZXJlZIhjb25udYlGcmFuY2WKMzWLMIxDT05OVSBOsDEgLSAyMDIxjTFkaCg0KTNpZiAoMCw5KSA0OHRhMSAzZnJwNCw1LSAoMSw3KSAtM2ppbzE1PiBmcmRipzIupyAoMCwxKSAyNHDiKDMpMy0-IC01aXMsNC5pcnA2Ziw2LeAgLWlmcmRiMS4gKC02LDEzKSAzLDhtNDgsOS2PRkZBdm9sdGlnZZAyMDIxLjEuMZFC',

    '2021 France Doret/excellence connu 2':
        'https://openaero.net/?s=hERvcmV0L2V4Y2VsbGVuY2WFQ09OTlUgTrAwMoYyMDIxh3Bvd2VyZWSIY29ubnWJRnJhbmNlijM1izCMQ09OTlUgTrAyIC0gMjAyMY1laiAzaWZycDMyLSAtM3RhNK4nICgwLDQpILJCYig0LikzNC0-IC1pcywyaW4oZi4prjgupyAifCI4LmtmIDI0bWlmOzkgKDAsMTgpIDNqb2k1MS0gLTgsNHAosikuM6c-IDI0ZGguMmanj0ZGQXZvbHRpZ2WQMjAyMS4xLjGRQg',

    '2021 IAC Primary Known':
        'https://openaero.net/?s=hFByaW1hcnmGMjAyMYdwb3dlcmVkiEtub3duiUlBQ4o1izCNZCBpdmA2c66nIC5jLicyYCvgICgtOCwxNCkgbyAyaisgMY9JQUOQMjAyMS4xLjGRQg',

    '2021 IAC Sportsman Known':
        'https://openaero.net/?s=hFNwb3J0c21hbodwb3dlcmVkiEtub3duiUlBQ4oxMIswjW8gY66upywyNK6nIG0yqysgKDUsMCkgaWcyrq4upyAoLTMsMCkg_munMi6nIGIgKy5oLif-IKcx_iAzJSAzao9JQUOQMjAyMS4xLjGRQg',

    '2021 IAC Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYYyMDIxh3Bvd2VyZWSIS25vd26JSUFDijE1izCNcChmKSt-IC9-K3YuJzQuKyA-IH7g4DVzrq6uJ2lrIDglIDJpY-Dg4OBgIDklIP4yaiAxIDUlIKcyYSD-aDQuICssNGL-PiBkaK6uJ6urqyD-MjRnIDFqMY9JQUOQMjAyMS4xLjGRQg',

    '2021 IAC Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2VkhjIwMjGHcG93ZXJlZIhLbm93bolJQUOKMjWLMIxDcm9zcy1Cb3ggRW50cnmNZWogL34rLqc0p3JwKCwxKSczLqcsMzQrYCAnLDgnaK4uM2auLierKyAoMiwwKSB-pzQsM-B3Mi0gLTFpcK1-ICgyLDApIC0uJ2lzrq6uLidpbigupywyZq4nKa6uri4gMjR5Lqc4IH4rNHBiLicyJ6urK34-IK4uJzI0bbInLGYgM2pvM49JQUOQMjAyMS4xLjGRQg',

    '2021 IAC Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIYyMDIxh3Bvd2VyZWSIS25vd26JSUFDijQwizCNMacsOW2yJyw2aWarfiBbLTYsMF0g4G4orq4uNmlmrq6urqcprq4up7Kuri6nrS1-IH4taW85Lf4g_q0tpzGurq4uJ2liLDM0YC1eIH4tpzVpc6csMq6uaXJwJzNmLiwzNOAtPiAv4C0zam8xNSB0YTNmLqd-PiDgKzMncGInNKcsMqerqyt-IKsrLqc0pywzrmRoKCc0pymuLic1Zq4up6v-IKdhYygyaWYpuK2PSUFDkDIwMjEuMS4xkUI',

    '2021 IAC-Glider Sportsman Known':
        'https://openaero.net/?s=hFNwb3J0c21hboYyMDIwh2dsaWRlcohLbm93bolJQUOKMTWLMI0yaiAzJSBtLSAtMiBpdidzri4nIOBgK29qqyt-IDMlIOArM2ogMSA3JSDgYGMy4ODgK-Agb49JQUOQMjAyMC4xLjKRQg',

    '2021 IAC-Glider Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYYyMDIwh2dsaWRlcohLbm93bolJQUOKMTWLMIxHbGlkZXKNMjQtIDYlIC1hMSAyPiAuJ20yIGl2c66nK_4gaDQgM2ogMnJjICgtMTMsMjEpIOMoMiksMjSPSUFDkDIwMjAuMS4ykUI',

    '2021 IAC-Glider Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2VkhjIwMjCHZ2xpZGVyiEtub3duiUlBQ4oyNYswjEdMSURFUo1lZCAiQEEiIC0xJSAvfiwyYSwyLX4gIkBCIiAtMjRx4OAgaC4nICJARSIgbyyyICJAQyIgL-DgYCtpdGHg4GAsNCvgYCAiQEQiIGBiLic0IP60_iAtMiUg4CtwKCwyKS4nKyAydKf-IGqPSUFDkDIwMjAuMS4ykUI',

    '2021 IAC-Glider Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIYyMDIwh2dsaWRlcohLbm93bolJQUOKMjWLMIxHTElERVKNLTIlIP5gLDZhLDErfiAiQEMiICtiricyaWanK-BgICJAQiIgLTIlIG9mICJARCIgL-DgK2l0YeDgYDSnK-BgICsnaCsgIkBFIiB-KzFqbzErfiAoLTMsMCkgfuAsMjRgaXBgfiAoLTUssSkgIkBBIiBpZCcyZuAsMicrYCAtMiUg4GArJ3AoLDIpLqcrIGAr4DQncGJgj0lBQ5AyMDIwLjEuMpFC',

    '2021 NZAC Primary Known':
        'https://openaero.net/?s=hFByaW1hcnkghjIwMjCHcG93ZXJlZIhLbm93bokyMC8yMSBOWkFDijONNSUgZCBpdq5zLqcrfiAtMSUgri4nY64uMq4uK2AgMSUg4CtvK2AgOCUgfisyaisgLicxK36PTlpBQ5AyMDIwLjEuNZFC',

    '2021 NZAC Recreational Known':
        'https://openaero.net/?s=hFJlY3JlYXRpb25hbIdwb3dlcmVkiEtub3duIIkyMC8yMSBOWkFDijaNJ20yICgtMTgsMCkgOCUg_jJq_iD-K2l2p3On_iB-KydoricrfiD-YGIuJyAoLTYsMCkgLTIlIGBjrq4nMivgIC0xJSDgK28rYCAnMWB-j05aQUOQMjAyMC4xLjWRQg',

    '2021 NZAC Sports Known':
        'https://openaero.net/?s=hFNwb3J0c4dwb3dlcmVkiEtub3duiTIwLzIxIE5aQUOKMTCLMI02JSBkIKsraXYupzZzLqerq6urICgtMiwwKSB-q6urK2supzI0rq4uIDIlIGIgq6suJ2iurierqyt-ICgyLDApIK6uridtLDKrK34gL6urKzJqq6srPiAxOSUgJywyYStgICtv_iAtMiUgp2MuJywyLicrIC8raisgpzH-j05aQUOQMjAyMC4xLjWRQg',

    '2021 NZAC Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYdwb3dlcmVkiEtub3duiTIwLzIxIE5aQUOKMjCLMI1yef4g_nZ-ICtpdq4nNXMupyArYDSnYi4nfiBkaK6urq6rIG9mIDclIG0tfiAtrieyrf4gKC0yLDApIDIxJSAt4GBhMSt-ICtori6rqysgMiUgMjRnfiAxajGPTlpBQ5AyMDIwLjEuNZFC',

    '2021 NZAC Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh3Bvd2VyZWSIS25vd26JMjAvMjEgTlpBQ4ozMIswjWFjKDI0KTJmLDYtIC1oLjNmrierfiCrMjSncOIoJzIupymnOK3-PiCtLqdpcy4naW4opzJmLicprq4uIGAr4DhwYjJmp6v-ICwyp2JgLDiuricgMjRtNCwzrX4gKDIsMCkgLacsMjRpcmMxLX4gKC0zLDEzKSAxJSAtMmoxNY9OWkFDkDIwMjAuMS41kUI',

    '2021 NZAC Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIdwb3dlcmVkiEtub3duiTIwLzIxIE5aQUOKNDCLMI1laiAxJSAvfqsuNCwyZidycCi0KacyNKcsNiD-Ljh0YS4nM2lmri4nK-BgICgtMiwwKSD-MW4ori6nNmlmrikuJywyNC4tIDMlIC01aXOnLDJmrqc7PmlicGIo4ODgMykuJywxpyAoMiwwKSCyYWMoLDQ4KTM0LDct4ODg4GAgLy0zamlvMTUr_iAycGKuLiczZq6nq6srIC9-KyczNC5irjQsMq4uqyAxZGgo4CkuJ2YuJ49OWkFDkDIwMjAuMS41kUI',

    '2021 VINK Club Known':
        'https://openaero.net/?s=hENsdWKGMjAyMYdwb3dlcmVkiEtub3duiVZJTkuKMTCLMI1vIC0yJSBjLiwyrq4gMj4gaKsrIDJqIDGPVklOS5AyMDIxLjEuMZFC',

    '2021 VINK Sports Known':
        'https://openaero.net/?s=hFNwb3J0c4VET05BQ4YyMDIxh3Bvd2VyZWSIS25vd26JVklOS4oxNYswjS4ycmMrIH5ori4nIG8gbTIgKC2xLDE0KSAyaiBkIGl2YDZzrqcrIC0yJSBvaqurICg3LDgpIGArM2orIC0xJSBjLiwyri6PVklOS5AyMDIxLjEuMZFC',

    '2020 CIVA Unl Free Known':
        'https://openaero.net/?s=hFVubGltaXRlZIdwb3dlcmVkiFByb2dyYW1tZTGJQ0lWQYo0MIswjSJAQSIgLeDgYDUsOC6nZ2anICJAQiIgLSw1dGHgM2YgIkBDIiA2YWMosiksM2lmLDggIkBEIiA0LDNpZmg2ICJARSIgLTNqb2kzLY9DSVZBkDIwMTkuMi40kWdyaWQ6NQ',

    '2020 CIVA Adv Free Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh3Bvd2VyZWSIUHJvZ3JhbW1lMYlDSVZBijMwizCNIkBBIiAsNGgzZiAiQEIiIODgNnMup2lrNCwzLSAiQEMiIDI0aWFjKDYpICJARCIgMnBi4CwzpyAiQEUiIDI0dywxj0NJVkGQMjAyMC4xkWdyaWQ6NQ',

    '2020 CIVA Yak52 Free Known':
        'https://openaero.net/?s=hFlhazUyh3Bvd2VyZWSIUHJvZ3JhbW1lMYlDSVZBijMwizCNIkBBIiBzaXJwMv4gIkBCIiAyNHQrICJAQyIgMmZpY6cyLSAiQEQiICw0cGIgIkBFIiAxajUtj0NJVkGQMjAxOS4yLjSRZ3JpZDo1',

    '2020 CIVA Int Free Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYdwb3dlcmVkiFByb2dyYW1tZTGJQ0lWQYozMIswjSJAQSIgc2lycDL-ICJAQiIgMjR0KyAiQEMiIDJmaWOnMi0gIkBEIiAsNHBiICJARSIgMWo1LY9DSVZBkDIwMTkuMi40kWdyaWQ6NQ',

    '2020 CIVA-Glider Unl Free Known':
        'https://openaero.net/?s=hFVubGltaXRlZIdnbGlkZXKIRnJlZSBLbm93bolDSVZBijE1izCNIkBBIiBpZDJmLDIgIkBCIiBvZiAiQEMiIGKuMmlmICJARCIgaXRhNCAiQEUiIDFqbzGPQ0lWQZAyMDE5LjIuNJFncmlkOjU',

    '2020 CIVA-Glider Adv Free Known':
        'https://openaero.net/?s=hEFkdmFuY2Vkh2dsaWRlcohGcmVlIEtub3duiUNJVkGKMTWLMI0iQEEiIDJhMi0gIkBCIiAtMjRxICJAQyIgaXRhNCAiQEQiIGKuNCAiQEUiIG-yj0NJVkGQMjAxOS4yLjSRZ3JpZDo1',

    '2020 AAC Graduate Known':
        'https://openaero.net/?s=hEdyYWR1YXRlhjIwMjCHcG93ZXJlZIhLbm93bolBQUOKMTCLMI3g4OAy4HJjfiAoLTksNSkgbTIgKDMsMTApIGl2cyAoNiwwKSBoICgtNCw4KSBvICgtMywwKSAyaiAoNiwxKSAxj0FBQ5AyMDIwLjEuOZFC',

    '2020 AAC Sportsman Known':
        'https://openaero.net/?s=hFNwb3J0c21hboYyMDIwh3Bvd2VyZWSIS25vd26JQUFDijE1izCNYi4nICgxNiwwKSBrLiwyLiAoLTIxLDApIGOuLicyIGQgKDgsMCkgaXY1cyAoMCwxKSBoNC4gKC0xOSwwKSAsMmcgKDE2LDEyKSBpcmMyICgtMjEsMCkgMmogKDcsMCkgso9BQUOQMjAyMC4xLjmRQg',

    '2020 France Espoirs connu':
        'https://openaero.net/?s=hEVzcG9pcnOGMjAyMIdwb3dlcmVkiGNvbm51iUZyYW5jZYoxMIswjENvbm51IEVTcG9pciAyMDIwjWQxfiAraXauJzZzrn4gKC02LDApIGRoKGAprq4gKDEsMCkgYqcgIkJyZWFrIiCnMnJjICgtMTMsMTYpIG02ICgwLDEpIDIssi0gKDYsMCkg_i1qra2tICgwLDEpIC0sMo9GRkF2b2x0aWdlkDIwMTguMy4xNJFC',

    '2020 France Desavois/promotion connu':
        'https://openaero.net/?s=gUZSQYREZXNhdm9pcy9wcm9tb3Rpb26GMjAyMIdwb3dlcmVkiGNvbm51iUZyYW5jZYoxNYswjWVqIH4rpzSncnCuLLIgYWMoMiktIGAtaXauLidpc66uq6urIGAsMmKuri4nICgtMiwwKSAiQnJlYWsiIG9mICgtMiwwKSAubactICgtNCwxNSkg_i0uJ2lyYzKtrS3-IC0yajItICgtNCwxMikgLTI0LDFjrq6nMjQuj0ZGQXZvbHRpZ2WQMjAxOC4zLjE0kUI',

    '2020 France National_2 connu 1':
        'https://openaero.net/?s=hE5hdGlvbmFsXzKFQ09OTlUgTm8xhjIwMjCHcG93ZXJlZIhjb25udYlGcmFuY2WKMjCLMI1laiD-JzI0Lmg0pz4gKC01LDApIG2yLSAtaXauNWlzLqcgLDhirj4gIkJyZWFrIiBvsiAyZGiuMq4uJ34gKC0yMSwwKSB2Li0gLa6uLicsMidpcmNmLDEtIC0sNCwzIDMlIDJqMTUtIC0yaWY7so9GRkF2b2x0aWdlkDIwMjAuMS42kUI',

    '2020 France National_2 connu 2':
        'https://openaero.net/?s=hE5hdGlvbmFsXzKFQ09OTlUgTjAyhjIwMjCHcG93ZXJlZIhjb25udYlGcmFuY2WKMjCLMI1lZCAtMWcyNC0grS1pdjVpc64uJysgMjRwYi6nNC4gKDIsMCkgIkJyZWFrIiBvMi0gLW0xICgzLDE3KSAyZi0grS0zam8zra2trS3-IC3gaDSnq34-IC0zJSAxY66uLjI0IH4yYq4uIGRmj2xpYnJlX3ZvbHRpZ2WQMjAxOC4zLjE0kUI',

    '2020 France Doret/excellence connu 1':
        'https://openaero.net/?s=hERvcmV0L2V4Y2VsbGVuY2WFQ09OTlUgTm8xhjIwMjCHcG93ZXJlZIhjb25udYlGcmFuY2WKMzWLMI20ZGJmLSAtLiw0OGl0YWAsMjSuJyAoMCw4KSAsM2lmcGLgLDMuPiAsM3BCYigsMiksMSctIC1pdjVpcywxIDMsMzRyYzMsMzQtICg0LDE4KSAtsm0yaWY7OS0gLTNqbzE1ICgtMiw2KSAya2Y7MY9GRkF2b2x0aWdlkDIwMjAuMS42kUI',

    '2020 France Doret/excellence connu 2':
        'https://openaero.net/?s=hERvcmV0L2V4Y2VsbGVuY2WFQ09OTlUgTjAyhjA3LzIwh3Bvd2VyZWSIY29ubnWJRnJhbmNlijM1izCNZWogM2ZycCgssik0OC0gKDMsLTEpIK2tpyw0OHRhrq6uri6nrSD-rS2nInwisnJwsiw5ICg5LC01KSBuKDJmKTQtICgyLDEwKSAtrqc1aXOuLmlycKdpZqc7Ma1-IP6tLTNqb2kxNaurqyt-ICgzLDIpIH6r4DI0cGKuM2lmLj4gKC0zLDApICunMzKnZGiurq6nrSAtLDjgYHJwri6nNSwzLY9GRkF2b2x0aWdlkDIwMTguMy4xNJFC',

    '2020 IAC Primary Known':
        'https://openaero.net/?s=hFByaW1hcnmGMjAyMIdwb3dlcmVkiEtub3duiUlBQ4o1izCNZP4g_itpduBgNnOuLicgKC0yLDApIGMuJzJgK-AgKC0yLDgpIG8gMmorIDGPSUFDkDIwMjAuMS4z',

    '2020 IAC Sportsman Known':
        'https://openaero.net/?s=hFNwb3J0c21hbodwb3dlcmVkiEtub3duiUlBQ4oxMIswjWQgaXY2c64uq6srICgtMywwKSD-a6cyNK6uK-Ag4GIr4CBorq6uIDMlIK4uJ20yIH6rMmorfj4gKDIsMCkgMjMlIOAyYSvgYCBvIC0xJSBjLiwyLqcgaiAyPiAxj0lBQ5AyMDIwLjEuMpFC',

    '2020 IAC Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYYyMDIwh3Bvd2VyZWSIS25vd26JSUFDijE1izCNYHJ5LicgdiBpdjVzrqcrID4gKzQnYi4nK-BgIGRorq6upyBvZiA3JSBgbS0gLS6yrSAyMyUgMz4gLeBgYTF-ICtorqerqyAnMjRgZ6cgMWoxj0lBQ5AyMDIwLjEuMpFC',

    '2020 IAC Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2VkhjIwMjCHcG93ZXJlZIhLbm93bolJQUOKMjWLMI1hYygyNCkyZiw2LeDg4OAgLWinM2Yup6t-IKsyNHDiKOAyLiknOOAt_j4gLWlzLmluKGAyZicprqcgKC0yLDApIOAr4DhwYmAyZqerfiD-LDKnYmAsOK6uK-BgIOAyNCdtNCwzLSAoMSwwKSAtMSUgYCAtLicsMjRpcmMxLX4gKC0yLDgpIP4tMmoxNY9JQUOQMjAyMC4xLjKRQg',

    '2020 IAC Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIYyMDIwh3Bvd2VyZWSIS25vd26JSUFDijQwizCNZWogL_6rLjQnLDJmp3JwKCy0KScyNC4nLDYgLjh0YTNpZq6uK-DgYCAzPiArMW4ori6nNmlmLicppywyNC4tIDUlIC_gLTVpcywyZi6naWJwYijg4OBgMykuJywxYCvgYCDgsmFjKCw0OCkzNCcsNy3g4ODg4CDgLTNqaW8xNSB-KzJwYq6nM2auJ6urfiArMzRiLjSnLDKuLicrfl4gMWRoLidmLo9JQUOQMjAyMC4xLjKRQg',

    '2020 IAC-Glider Sportsman Known':
        'https://openaero.net/?s=hFNwb3J0c21hboYyMDIwh2dsaWRlcohLbm93bolJQUOKMTWLMI0yaiAzJSBtLSAtMiBpdidzri4nIOBgK29qqyt-IDMlIOArM2ogMSA3JSDgYGMy4ODgK-Agb49JQUOQMjAyMC4xLjKRQg',

    '2020 IAC-Glider Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYYyMDIwh2dsaWRlcohLbm93bolJQUOKMTWLMIxHbGlkZXKNMjQtIDYlIC1hMSAyPiAuJ20yIGl2c66nK_4gaDQgM2ogMnJjICgtMTMsMjEpIOMoMiksMjSPSUFDkDIwMjAuMS4ykUI',

    '2020 IAC-Glider Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2VkhjIwMjCHZ2xpZGVyiEtub3duiUlBQ4oyNYswjEdMSURFUo1lZCAiQEEiIC0xJSAvfiwyYSwyLX4gIkBCIiAtMjRx4OAgaC4nICJARSIgbyyyICJAQyIgL-DgYCtpdGHg4GAsNCvgYCAiQEQiIGBiLic0IP60_iAtMiUg4CtwKCwyKS4nKyAydKf-IGqPSUFDkDIwMjAuMS4ykUI',

    '2020 IAC-Glider Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIYyMDIwh2dsaWRlcohLbm93bolJQUOKMjWLMIxHTElERVKNLTIlIP5gLDZhLDErfiAiQEMiICtiricyaWanK-BgICJAQiIgLTIlIG9mICJARCIgL-DgK2l0YeDgYDSnK-BgICsnaCsgIkBFIiB-KzFqbzErfiAoLTMsMCkgfuAsMjRgaXBgfiAoLTUssSkgIkBBIiBpZCcyZuAsMicrYCAtMiUg4GArJ3AoLDIpLqcrIGAr4DQncGJgj0lBQ5AyMDIwLjEuMpFC',

    '2020 NZAC Primary Known':
        'https://openaero.net/?s=hFByaW1hcnkghjIwMjCHcG93ZXJlZIhLbm93biBDb21wdWxzb3J5iU5aQUOKM401JSBkIGl2rnMupyt-IC0xJSCuLidjri4yri4rYCAxJSDgK28rYCA4JSB-KzJqKyAuJzErfo9OWkFDkDIwMTkuMpFC',

    '2020 NZAC Recreational Known':
        'https://openaero.net/?s=hFJlY3JlYXRpb25hbIYyMDIwh3Bvd2VyZWSIS25vd24gQ29tcHVsc29yeYlOWkFDijaNJ20yICgtMTgsMCkgOCUg_jJq_iD-K2l2p3On_iB-KydoricrfiD-YGIuJyAoLTYsMCkgLTIlIGBjrq4nMivgIC0xJSDgK28rYCAnMWB-j05aQUOQMjAxOS4ykUI',

    '2020 NZAC Sports Known':
        'https://openaero.net/?s=hFNwb3J0c4YyMDIwh3Bvd2VyZWSIS25vd26JTlpBQ4oxMIswjW9-IH6raK6rK34gWy2xLDBdIH6uLidtLDKrKyCurqdpcmMyKyA5JSB-qzJqKyArMSsgNiUg4ODg4CuupywyYSD-q6urq6trLicyrq4r4CBiLivgYCBjLjKnK49OWkFDkDIwMTkuMpFC',

    '2020 NZAC Intermediate Known':
        'https://openaero.net/?s=hEludGVybWVkaWF0ZYYyMDIwh3Bvd2VyZWSIS25vd26JTlpBQ4oyMIswjW9mICgtMiwwKSCrK-BgZGiurqerq6sr_iAoLTIsMCkgfqsrbijgMqcpIGl24GA2c66uLicrIC5tMa2tfiAoMiwwKSAt4GBpYWMoMikgaDSnIH4rYDSnYier_iB-q-AsMjQup2cgMWoxj05aQUOQMjAxOS4yLjGRQg',

    '2020 NZAC Advanced Known':
        'https://openaero.net/?s=hEFkdmFuY2VkhjIwMjCHcG93ZXJlZIhLbm93bolOWkFDijMwizCN_qc2dzGrfiAxOCUgYTQsMyBgLDin4ihgM2auKS0-IOAt4GBpc66up2luKK4uMmaurimuri6nIKurKzI0ZGiuMmauLicgYWMoNDgpNivg4GAgM2pvMyD-K2KuJzOuJ6srfiCuri6nsm20LY9OWkFDkDIwMTkuMi4xkUI',

    '2020 NZAC Unlimited Known':
        'https://openaero.net/?s=hFVubGltaXRlZIYyMDIwh3Bvd2VyZWSIS25vd26JTlpBQ4o0MIswjWlmJ3J5Licssqcg4CtgLDgsMi5w4ig1Zi6nKScxLT4gLeBgNWlzOzNmaXJwNDj-IDIwJSAv4ODgYCszamlvMys-IKdpdGGuLqcsM2lmrq6urq6uK-A-IDMlIH6rq6urKzI0YHLwKLQpK-BgIH6rKy4nbihgNWlmLDMpLqcxLqctYCAtMmY7MSdpcmRiYLIurSDgLTlpYWMo4DZm4CknNywzNCvg4GCPTlpBQ5AyMDE5LjKRQg',

    '2019 CIVA Unl Free Known':
        'https://openaero.net/?s=gEFsbIJBbGyEVW5saW1pdGVkh3Bvd2VyZWSIUHJvZ3JhbW1lMYlDSVZBijQwizCNIkBBIiAxJSAsM2ZoM6ctXj4gKDAsNikgMSUgIkBCIiA0am8yICgwLDEzKSAyJSAiQEMiIC3g4LIsMmFjKGA2aWZgKTHg4C0gKDAsOSkgIkBEIiA2cChpZiksMjQgKDAsNSkgIkBFIiDgczsyaW4oLDQ4KTGPQ0lWQZAyMDE4LjSRZ3JpZDo1',

    '2019 CIVA Adv Free Known':
        'https://openaero.net/?s=gEFsbIJBbGyEQWR2YW5jZWSHcG93ZXJlZIhQcm9ncmFtbWUxiUNJVkGKMzCLMI0iQEEiIDFkaCg0KTNmJyAoMCwxMCkgIkBCIiAyJSAsMnBi4CwzpyAoMCw0KSAiQEMiIC1gaXOnaXJwMywzNC1-ICgwLDIzKSAiQEQiIDMlIC02bTZmICgwLDEzKSAyJSAiQEUiIC0yajItj0NJVkGQMjAxOC40kWdyaWQ6NQ',

    '2019 CIVA Int Free Known':
        'https://openaero.net/?s=gEFsbIJBbGyESW50ZXJtZWRpYXRlh3Bvd2VyZWSIUHJvZ3JhbW1lMYlDSVZBijMwizCNIkBBIiAtMSUgb7IgKDAsNikgIkBCIiAsNGggKDAsNikgIkBDIiAtNCUg4OA2cy4naWsxICgwLDEyKSAiQEQiIDFqbzEgKDAsMTYpIDIlICJARSIgbWY7MjSPQ0lWQZAyMDE4LjSRZ3JpZDo1',

    '2019 CIVA-Glider Unl Free Known':
        'https://openaero.net/?s=gEFsbIJBbGyEVW5saW1pdGVkh2dsaWRlcohGcmVlIEtub3duiUNJVkGKMTWLMI0iQEEiIDIlIDJhsiAiQEIiIDElIG8yLSAiQEMiIDElIOBgLXRhK-BgICJARCIgMmZ0NCAyJSAiQEUiIDFqbzGPQ0lWQZAyMDE4LjSRZ3JpZDo1',

    '2019 CIVA-Glider Adv Free Known':
        'https://openaero.net/?s=gEFsbIJBbGyEQWR2YW5jZWSHZ2xpZGVyiEZyZWUgS25vd26JQ0lWQYoxNYswjTElICJAQSIgLDRpcnAnLCJ8IjI0fiAoMCw4KSA2JSAiQEIiIGl2NCAoMCwyMSkgIkBDIiA2JSC0bS0gKDAsMTApIC0xJSAiQEQiIC1pZDI0ICgwLDEyKSAtMiUgIkBFIiBpdGHgNKePQ0lWQZAyMDE4LjSRZ3JpZDo1',

    '2019 AAC Graduate Known':
        'https://openaero.net/?s=gkFsbIRHcmFkdWF0ZYYyMDE5h3Bvd2VyZWSIS25vd26JQUFDijKLMI1vICg2LDApIGiuLicgKC01LDApIGSnICgtMiwwKSBpdi6nNnMuJyAoMTksMCkgY64uJywyLiAoLTcsMCkgbTIgKDI1LDApIGogKC0xLDMpIDNqICgtMiwwKSAsMY9BQUOQMjAxOS4xLjeRQg',

    '2019 AAC Sportsman Known':
        'https://openaero.net/?s=gkFsbIRTcG9ydHNtYW6GMjAxOYdwb3dlcmVkiEtub3duiUFBQ4o0izCNZWQgLDJnICgxMCwwKSBpdqc1c6cgaDSnICgtNiwwKSBiICgtOCwwKSB-YGuupzKnICg5LDApIG0sMiAoLTIwLDEwKSBpZ-AypyAoMSwwKSBvICgzLDApIDJqICgtNywwKSCyj0FBQ5AyMDE5LjEuNpFC',

    '2019 BAeA Club Known':
        'https://openaero.net/?s=gkFsbIRDbHVih3Bvd2VyZWSIS25vd26JQkFlQYoxMIswjS0yJSBjMq4gaK4nIG8gNSUg4GAr4ODg4DLgcmMr4ODgIDGPQkFlQZAyMDE5LjEuM5FC',

    '2019 BAeA Sports Known':
        'https://openaero.net/?s=gkFsbIRTcG9ydHOHcG93ZXJlZIhLbm93bolCQWVBijE1izCN4ODgYDLgcmOyK-Dg4OAgMj4gLTIlIGOuricyIGiuLit-IDJnICgxMCwwKSBpduBgNnOurierq6srIG0yICgxNiwxNykgMmo-IGArri4naXJjMisgLLSPQkFlQZAyMDE5LjEuM5FC',

    '2019 IAC Primary Known':
        'https://openaero.net/?s=gkFsbIRQcmltYXJ5hjIwMTmHcG93ZXJlZIhLbm93bolJQUOKNYswjWT-IP4raXbgYDZzri4nICgtMiwwKSBjLicyYCvgICgtMiw4KSBvIDJqKyAxj0lBQ5AyMDE5LjEuNA',

    '2019 IAC Sportsman Known':
        'https://openaero.net/?s=gkFsbIRTcG9ydHNtYW6GMjAxOYdwb3dlcmVkiEtub3duiUlBQ4oxMIswjW9-IH6raK6rK34gWy2xLDBdIH6uLidtLDKrKyCurqdpcmMyKyA5JSB-qzJqKyArMSsgNiUg4ODg4CuupywyYSD-q6urq6trLicyrq4r4CBiLivgYCBjLjKnK49JQUOQMjAxOS4xLjSRQg',

    '2019 IAC Intermediate Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWGMjAxOYdwb3dlcmVkiEtub3duiUlBQ4oxNYswjW9mICgtMiwwKSCrK-BgZGiurqerq6sr_iAoLTIsMCkgfqsrbijgMqcpIGl24GA2c66uLicrIC5tMa2tfiAoMiwwKSAt4GBpYWMoMikgaDSnIH4rYDSnYier_iB-q-AsMjQup2cgMWoxj0lBQ5AyMDE5LjEuNJFC',

    '2019 IAC Advanced Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIYyMDE5h3Bvd2VyZWSIS25vd26JSUFDijI1izCN_qc2dzGrfiAxOCUgYTQsMyBgLDin4ihgM2auKS0-IOAt4GBpc66up2luKK4uMmaurimuri6nIKurKzI0ZGiuMmauLicgYWMoNDgpNivg4GAgM2pvMyD-K2KuJzOuJ6srfiCuri6nsm20LY9JQUOQMjAxOS4xLjSRQg',

    '2019 IAC Unlimited Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSGMjAxOYdwb3dlcmVkiEtub3duiUlBQ4o0MIswjWlmJ3J5Licssqcg4CtgLDgsMi5w4ig1Zi6nKScxLT4gLeBgNWlzOzNmaXJwNDj-IDIwJSAv4ODgYCszamlvMys-IKdpdGGuLqcsM2lmrq6urq6uK-A-IDMlIH6rq6urKzI0YHLwKLQpK-BgIH6rKy4nbihgNWlmLDMpLqcxLqctYCAtMmY7MSdpcmRiYLIurSDgLTlpYWMo4DZm4CknNywzNCvg4GCPSUFDkDIwMTkuMS40kUI',

    '2019 IAC-Glider Sportsman Known':
        'https://openaero.net/?s=gkFsbIRTcG9ydHNtYW6GMjAxOYdnbGlkZXKIS25vd26JSUFDijE1izCNMi5yY6v-IDIucmRirivg4OBgICgwLDkpIG8gfitqIKsrb2qrICsuMi50rqerq_4gq6toq34gMY9JQUOQMjAxOS4xLjSRQg',

    '2019 IAC-Glider Intermediate Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWGMjAxOYdnbGlkZXKIS25vd26JSUFDijE1izCNZCBpduBgNnOuLv4gaXRhIDJqq6ur_iBoNCsgq29qK_4gLDKncmMgKC0yLLEpICeyIP4rMWoxj0lBQ5AyMDE5LjEuNJFC',

    '2019 IAC-Glider Advanced Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIYyMDE5h2dsaWRlcohLbm93bolJQUOKMjWLMI0yaWFvqyv-IDJhMjQsMiAoMCyxKSBkIGl24GA1cy4nIGg0IOArLDSnYiw4PiBwKDIppyAutCsgYDKncmRij0lBQ5AyMDE5LjEuNJFC',

    '2019 IAC-Glider Unlimited Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSGMjAxOYdnbGlkZXKIS25vd26JSUFDijI1izCNaWQyNC0gMj4gLTJyYy3-ICgwLLEpIC2uJzJjLicyaWYgLiyyKyB0YeA0LiBi4GAzaWYuIG8xIH6raKt-IDFqbzGPSUFDkDIwMTkuMS40kUI',

    '2019 NZAC Primary Known':
        'https://openaero.net/?s=gkFsbIRQcmltYXJ5IIYyMDE5h3Bvd2VyZWSIS25vd24gQ29tcHVsc29yeYlOWkFDijONNSUgZCBpdq5zLqcrfiAtMSUgri4nY64uMq4uK2AgMSUg4CtvK2AgOCUgfisyaisgLicxK36PTlpBQ5AyMDE4LjMuNZFC',

    '2019 NZAC Recreational Known':
        'https://openaero.net/?s=gkFsbIRSZWNyZWF0aW9uYWyGMjAxOYdwb3dlcmVkiEtub3duIENvbXB1bHNvcnmJTlpBQ4o2jSdtMiAoLTE4LDApIDglIP4yav4g_itpdqdzp_4gfisnaK4nK34g_mBiLicgKC02LDApIC0yJSBgY66uJzIr4CAtMSUg4CtvK2AgJzFgfo9OWkFDkDIwMTguMy41kUI',

    '2019 NZAC Sports Known':
        'https://openaero.net/?s=gkFsbIRTcG9ydHOGMjAxOYdwb3dlcmVkiEtub3duiU5aQUOKMTCLMI1gK2QgfitpduDgNnMupyAoLTIxLDApIGguJyv-IG8gKC0yLDApIKsray4nLDI0ri6nICgwLDApIH5tMv4gKDAsMTIpIDEgqzJqqyt-IGlnYCwyLicr4CAoLTIsMCkgYy6nLDJgj05aQUOQMjAxOC4zLjY',

    '2019 NZAC Intermediate Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWGMjAxOYdwb3dlcmVkiEtub3duiU5aQUOKMjCLMI1yeat-IHar_iBpduBgNnOurierq6v-IH6rLDI0dK4uq6sgKC0yLDApIG9mIKs0aDKnICgxLC0xKSArYmAsNKerqyB-qyvgazKrq_4gKDIsMTIpIG0xrf4gKDEsMCkg_i2nMi4naXJjMjQgKC0yLDApIGArMWoxj05aQUOQMjAxOC4zLjaRQg',

    '2019 NZAC Advanced Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIYyMDE5h3Bvd2VyZWSIS25vd26JTlpBQ4ozMI1hYygyNCmyLSAvLWiuJzNmri4nXiDgLDgn4ijg4DJmpyknNK3-IC3gYDVpc2lycDQ4fiAyajE1LSAoLTQsOCkgfq0stGljpzQsM62tIC0sMWEzLDM0qyAoLTIsMTQpIP6rK-AyNGtmYKsgYDOncGJgOC4rfiC4j05aQUOQMjAxOC4zLjY',

    '2019 NZAC Unlimited Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSGMjAxOYdwb3dlcmVkiEtub3duiU5aQUOKNDCNYCwzaWan4ihgNS6nKSeyra2tLX4-ICgtMiwwKSD-LeDgYCJ8IjVpcywzaWanaWIupyw0LDOuK34gYCtpb7QrYCAoNywxNikg4CsnLDI0YGluKOBpZicpLjKuq6t-ICgyLDApIDZtNmlmOzQ4q6t-ICgxLDApIP4rMmoyICgxLDE0KSAvfqurqyunNGB0YeAyZi4nIDgsMidrYDNpZjszNOCrqyA1aKc1Zi4nIDlhYygnMmlmYCkzLDWPTlpBQ5AyMDE4LjMuMTCRQg',

    '2019 VINK Club Known':
        'https://openaero.net/?s=gkFsbIRDbHVihURPTkFDhjIwMTmHcG93ZXJlZIhLbm93bolWSU5LijEwizCNYy4sMiBoricgYCtvK2Ag4CtkK-AgYCtpduA2cy4gMY9WSU5LkDIwMTkuMS40kUI',

    '2019 VINK Sports Known':
        'https://openaero.net/?s=gkFsbIRTcG9ydHOFRE9OQUOGMjAxOYdwb3dlcmVkiEtub3duiVZJTkuKMTWLMI3g4OBgMuByY7Ir4ODgIC0yJSBjrq4nLDIgaK4nK34gMmer_iAzPiBpduBgNnOuri6rq34gND4gMiUgbTKrKyAyaiBgK64naXJjMisgLDGPVklOS5AyMDE5LjEuNJFC',

    '2018 CIVA Unl Free Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHcG93ZXJlZIhGcmVlIEtub3duiUNJVkGKNDCNIkBBIiBvM2YsMyAiQEIiIDM04jNpZi0-ICJAQyIgLeA2aXMsMmlycGYsMmlmICJARCIgLSw2dGFgMjQuICJARSIgM2ppbzUxLY9DSVZBkDIwMTguMZFncmlkOjU',

    '2018 CIVA Adv Free Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdwb3dlcmVkiEZyZWUgS25vd26JQ0lWQYozMIswjSJAQSIgLTQsM20sNjtmICJAQiIgZnJkYjI0ICJAQyIgMmRoKDgpMjQgIkBEIiDg4DZzrmlrNCwzNC0gIkBFIiAtMmoxNY9DSVZBkDIwMTguM5FncmlkOjU',

    '2018 CIVA Yak 52 Free Known':
        'https://openaero.net/?s=gkFsbIRZYWs1Modwb3dlcmVkiEZyZWUgS25vd26JQ0lWQYozMI0iQEEiIDRiICJAQiIgOGgyICJAQyIg4OAyNC4nZyAiQEQiIOBgcydpcnA0LDMgIkBFIiAtMWpvMS2PQ0lWQZAyMDE3LjIuNJFncmlkOjU',

    '2018 CIVA Int Free Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWHcG93ZXJlZIhGcmVlIEtub3duiUNJVkGKMzCNIkBBIiA0YiAiQEIiIDhoMiAiQEMiIODgMjQuJ2cgIkBEIiDgYHMnaXJwNCwzICJARSIgLTFqbzEtj0NJVkGQMjAxNy4yLjSRZ3JpZDo1',

    '2018 CIVA-Glider Unl Free Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSGMjAxOIdnbGlkZXKIRnJlZSBLbm93bolDSVZBijE1jENJVkEgZ2xpZGVyIFVubGltaXRlZCBGcmVlIEtub3duIGZpZ3VyZXMgMjAxOI0iQEEiIGtpZi3_oCJAQiIgLacsNKdpcnCtfv-gIkBDIiBgLWlhbzYtYP-gIkBEIiBgLTQ4aWcyK2D_oCJARSIgYCsnMmZgd49DSVZBkDIwMTguMZFncmlkOjU',

    '2018 CIVA-Glider Adv Free Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIYyMDE4h2dsaWRlcohGcmVlIEtub3duiUNJVkGKMTWMQ0lWQSBnbGlkZXIgQWR2YW5jZWQgRnJlZSBLbm93biBmaWd1cmVzIDIwMTiNIkBBIiAtMmlyYzEt_6AiQEIiIHRh4DQr4P-gIkBDIiBtNDj_oCJARCIgLTJ0_6AiQEUiIC1pby2PQ0lWQZAyMDE4LjGRZ3JpZDo1',

    '2018 France Espoirs connu':
        'https://openaero.net/?s=gkFsbIRFc3BvaXJzh3Bvd2VyZWSIY29ubnWJRnJhbmNlijEwizCNZWQgMmcgaXY1c64uXiBtLf4gNz4gfq2tLTNqLT4gKDIsMTIpIC3gMmOnMi6nIGiuricgbyAzJSBtMiAyJSAyan4-ILKPRkZBdm9sdGlnZZAyMDIwLjEuNQ',

    '2018 France Desavois/promotion connu':
        'https://openaero.net/?s=gkFsbIREZXNhdm9pcy9wcm9tb3Rpb26HcG93ZXJlZIhjb25udYlGcmFuY2WKMTWLMI1laiAv_issMqdoJzQu_j4gNz4gLm0xLSAyPiAtaXauJ2lzricgLzhiricr4CAyPiD-NGvgLeAg4C1vMitgIOArZGgoLimuri4nqyt-IDIlIDI-IK5tZi0gLTYg4GArMWpvMSvgYI9GRkF2b2x0aWdlkDIwMjAuMS41',

    '2018 France National_2 connu 1':
        'https://openaero.net/?s=gkFsbIROYXRpb25hbF8yh3Bvd2VyZWSIY29ubnUgMYlGcmFuY2WKMjCLMI0vdqc0Jy0gLWl2pyw1aXOnPiAyNGitLf4gLadtMi0gKDUsMTQpIC0yam9pMTUgLjljLqc0OC6nIC_g4CvgYHBiLiw0Lqf-IP6rpzgncnA4LDQrYCAyJSDgK-Dg4DJmYHJjK-Dg4ODgICgxMCwyMCkgp20xLDI0IDI-IC8zaj4gLGYsMY9GRkF2b2x0aWdlkDIwMjAuMS41',

    '2018 France National_2 connu 2':
        'https://openaero.net/?s=gkFsbIROYXRpb25hbF8yh3Bvd2VyZWSIY29ubnUgMolGcmFuY2WKMjCLMI1-KzI0ZGiuJzIupyA2PiAuJ20xLSAyPiAtaXauNWlzLiA0PiD-Jzgna6ctPiAtJzQnaC40LicgNT4gri4nbWYsMiDgYCuurmlyYyc0LDP-IDglIOArMmppbzIr4CAyPiBorqcgMjRnK34gND4gMmY7MjQr4I9GRkF2b2x0aWdlkDIwMjAuMS41',

    '2018 France Doret/excellence connu 1':
        'https://openaero.net/?s=gkFsbIREb3JldC9leGNlbGxlbmNlh3Bvd2VyZWSIY29ubnUgMYlGcmFuY2WKMzWLMI1laiAv_nanZi4nfl4-IOArLDVzp2liQijg4OAifCIz4CkupzSuLicrXj4gMz4gMSyybWlmLDI-IODgKzNqb2kzK34gMj4gLid0YS4sMq6uLic-IGAsNOBycCw1LDM0K34-IDI-IOBgK-AyNGBkaChgKa6uLDI0rqcrYF4-IODgYCsxLDJm4GBy4ygyNGApIDltMmlmLDYt4D6PRkZBdm9sdGlnZZAyMDIwLjEuNQ',

    '2018 France Doret/excellence connu 2':
        'https://openaero.net/?s=gkFsbIREb3JldC9leGNlbGxlbmNlh3Bvd2VyZWSIY29ubnUgMolGcmFuY2WKMzWLMI0raWZycLIgZnJkYi6nLDI0rq6nK-Dg4OAg4LJtLmYsMS3-IDc-IP6tLXBuKK6uLieyrq6uLqcpMa0gND4gLTVpcy5pcnCuJzUsOC0gMz4gLTIlIC0zajOtrX4-IDg-IGAtMjRkaK6usq4uqyv-IDI-IP4rMnJwKLIpOSDgK-CyLDJmcmOPRkZBdm9sdGlnZZAyMDIwLjEuNQ',

    '2018 IAC Primary Known':
        'https://openaero.net/?s=gkFsbIRQcmltYXJ5hjIwMTiHcG93ZXJlZIhLbm93bolJQUOKM4swjWT-IP4raXbgYDZzri4nICgtMiwwKSBjLicyYCvgICgtMiw4KSBvIDJqKyAxj0lBQ5AyMDE4LjEuNA',

    '2018 IAC Sportsman Known':
        'https://openaero.net/?s=gkFsbIRTcG9ydHNtYW6HcG93ZXJlZIhLbm93bolJQUOKNoswjWArZCB-K2l24OA2cy6nICgtMjEsMCkgaC4nK_4gbyAoLTIsMCkgqytrLicsMjSuLqcgKDAsMCkgfm0y_iAoMCwxMikgMSCrMmqrK34gaWdgLDIuJyvgICgtMiwwKSBjLqcsMmCPSUFDkDIwMTguMS40',

    '2018 IAC Intermediate Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWGMjAxOIdwb3dlcmVkiEtub3duiUlBQ4o4izCNcnmrfiB2q_4gaXbgYDZzrq4nq6ur_iB-qywyNHSuLqurICgtMiwwKSBvZiCrNGgypyAoMSwtMSkgK2JgLDSnq6sgfqsr4Gsyq6v-ICgyLDEyKSBtMa3-ICgxLDApIP4tpzIuJ2lyYzI0ICgtMiwwKSBgKzFqMY9JQUOQMjAxOC4xLjSRQg',

    '2018 IAC Advanced Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIYyMDE4h3Bvd2VyZWSIS25vd26JSUFDijEyjWFjKDI0KbItIC8taK4nM2auLideIOAsOCfiKODgMmanKSc0rf4gLeBgNWlzaXJwNDh-IDJqMTUtICgtNCw4KSB-rSy0aWOnNCwzra0gLSwxYTMsMzSrICgtMiwxNCkg_qsr4DI0a2ZgqyBgM6dwYmA4Lit-ILiPSUFDkDIwMTguMS40',

    '2018 IAC Unlimited Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSGMjAxOIdwb3dlcmVkiEtub3duiUlBQ4oyMI1gLDNpZqfiKGA1LqcpJ7Ktra0tfj4gKC0yLDApIP4t4OBgInwiNWlzLDNpZqdpYi6nLDQsM64rfiBgK2lvtCtgICg3LDE2KSDgKycsMjRgaW4o4GlmJykuMq6rq34gKDIsMCkgNm02aWY7NDirq34gKDEsMCkg_isyajIgKDEsMTQpIC9-q6urK6c0YHRh4DJmLicgOCwyJ2tgM2lmOzM04KurIDVopzVmLicgOWFjKCcyaWZgKTMsNY9JQUOQMjAxOC4zLjEwkUI',

    '2018 BAeA Club Known':
        'https://openaero.net/?s=gkFsbIRDbHVih3Bvd2VyZWSIS25vd26JQkFlQYoxMIswjS0zJSBgY6cyrq6nIOBori4gbyBpb2or_iD-Mf6PQkFlQZAyMDE4LjEuNA',

    '2018 BAeA Sports Known':
        'https://openaero.net/?s=gkFsbIRTcG9ydHOHcG93ZXJlZIhLbm93bolCQWVBijE1izCNZWQgLzJnICgzLDApIGl24DZzrq4uICgtMTAsMCkgbTIgsiAoLTcsMTMpIDJqIDI-IKtoricgYGIuK-AgLTMlIGBjpzKnICgwLDQpIDGPQkFlQZAyMDE4LjEuNJFC',

    '2018 NZAC Primary Known':
        'https://openaero.net/?s=gkFsbIRQcmltYXJ5IIdwb3dlcmVkiEtub3duIENvbXB1bHNvcnmJTlpBQ4ozjTUlIGQgaXaucy6nK34gLTElIK4uJ2OuLjKuLitgIDElIOArbytgIDglIH4rMmorIC4nMSt-j05aQUOQMjAxNy4xLjE',

    '2018 NZAC Recreational Known':
        'https://openaero.net/?s=gkFsbIRSZWNyZWF0aW9uYWyHcG93ZXJlZIhLbm93biBDb21wdWxzb3J5iU5aQUOKNo0nbTIgKC0xOCwwKSA4JSD-Mmr-IP4raXanc6f-IH4rJ2iuJyt-IP5gYi4nICgtNiwwKSAtMiUgYGOuricyK-AgLTElIOArbytgICcxYH6PTlpBQ5AyMDE3LjEuMZFC',

    '2018 NZAC Sports Known':
        'https://openaero.net/?s=gU5aTIJBbGyEU3BvcnRzh3Bvd2VyZWSIS25vd24gQ29tcHVsc29yeSAyMDE4iU5aQUOKMTCN4ygyKTIr4CAoMCwwKSAyJSDgbTIrYCAoLTI1LDI1KSAyJSB-Mmp-PiAoMCwwKSD-ZKsgKDAsMCkgaXYnNXMuICgwLDApIGIuJzQnq6srfiAoLTcsMCkgLTMlIP6na64uMjSurqcr4CAoLTIsMCkg4CtvK-Agqy5oLqsgsn6PTlpBQ5AyMDE3LjEuMZFC',

    '2018 NZAC Intermediate Known':
        'https://openaero.net/?s=gU5aTIJBbGyESW50ZXJtZWRpYXRlh3Bvd2VyZWSIS25vd24gQ29tcHVsc29yeSAyMDE4iU5aQUOKMjCNMyUgb7IgK3YuKyAoMCwwKSBpdi41cy4r4CAoMiwtMSkgYCs0aC6r_iAoMCwwKSD-qy4yZuBgd2ArfiAoMTAsMTQpIDElIC4nMjRhMq2tICgtMiwwKSAtcmO0ICgxNCwxNCkg4GAr4HBiLicyLqurIFstMiwwXSAyJSDgKzI0ZytgIDFqMY9OWkFDkDIwMTcuMS4x',

    '2018 NZAC Advanced Known':
        'https://openaero.net/?s=gU5aTIJBbGyEQWR2YW5jZWSHcG93ZXJlZIhLbm93biBDb21wdWxzb3J5IDIwMTiJTlpBQ4ozMI0nLCJ8IjI0YHJ5MiAoMCwwKSArJywyLmguLDQ4rq6uqyt-ICgtNiwwKSA0JSAnInwiOC7iKODgYCJ8IjTgKS4ypyv-ICgzLDApIP4rp3NpcnAsMmYsMi0gKC00LDE4KSA4JSAtMmppbzItICgxMywwKSB-La5oriJ8IjNmri6nICgwLDApIC0xJSArJzRgcnA2rf4gKC0xMywwKSAtridr4CwyZiwyNOBgICgwLDApIDElIKdtLDMyLDZmLY9OWkFDkDIwMTcuMS4x',

    '2018 NZAC Unlimited Known':
        'https://openaero.net/?s=gU5aTIJBbGyEVW5saW1pdGVkh3Bvd2VyZWSIS25vd24gQ29tcHVsc29yeSAyMDE4iU5aQUOKNDCNLiw0LDNmp2RoKC4prqczaWY7M66nICgtMjAsMCkgL6srLjI0rqdw4ijgZmApLicsInwiMy4nra3-IP4tric1aXNgLDIuJ2lycDMsMzQt_iAoLTEsMCkgMTMlIOBgLTJqMTUgKDQsMCkgMyUgLyuuLDjgdGEyaWauK-DgIKc0LDOnaDVmLiAoLTE4LDApIC8upzEup24oNWlmLDMuKac1J34gOCUg4GArLqczaWauJ2niKODg4ODgLDQsMuAppyw1YCvg4CD-J2YuJ2KurjI0J49OWkFDkDIwMTcuMS4x',

    '2017 CIVA Unl Free Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHcG93ZXJlZIhGcmVlIEtub3duiUNJVkGKNDCMU2VlICJDcmVhdGluZyBhIEZyZWUgS25vd24gc2VxdWVuY2UiIGluIHRoZSBtYW51YWyNIkBBIiA1cywifCIzaWJgMywyICJAQiIgMmppbzE1LSAyJSAiQEMiIOBgLTlpYWMoYDZmYCkzLDUt4OAgIkBEIiA0LDJmaDUgIkBFIiCybSwzaWYsNy2PQ0lWQZAyMDE3LjGRZ3JpZDo1',

    '2017 CIVA Adv Free Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdwb3dlcmVkiEZyZWUgS25vd26JQ0lWQYozMIxTZWUgIkNyZWF0aW5nIGEgRnJlZSBLbm93biBzZXF1ZW5jZSIgaW4gdGhlIG1hbnVhbI0iQEEiIC1pc2lycDI0LGYgIkBCIiAzam9pMyAiQEMiIDJmZ7QgIkBEIiA0aDIgIkBFIiAtMywzNG0sso9DSVZBkDIwMTcuMZFncmlkOjU',

    '2017 CIVA Yak 52 Free Known':
        'https://openaero.net/?s=gkFsbIRZYWs1Modwb3dlcmVkiEZyZWUgS25vd26JQ0lWQYozMIxTZWUgIkNyZWF0aW5nIGEgRnJlZSBLbm93biBzZXF1ZW5jZSIgaW4gdGhlIG1hbnVhbI0iQEEiIG1mLDEtICJAQiIgLTFqMS0gIkBDIiBkaDggIkBEIiAyZzI0LSAiQEUiIC1pduA1aXOnj0NJVkGQMjAxNy4xkWdyaWQ6NQ',

    '2017 CIVA Int Free Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWHcG93ZXJlZIhGcmVlIEtub3duiUNJVkGKMzCMU2VlICJDcmVhdGluZyBhIEZyZWUgS25vd24gc2VxdWVuY2UiIGluIHRoZSBtYW51YWyNIkBBIiBtZiwxLSAiQEIiIC0xajEtICJAQyIgZGg4ICJARCIgMmcyNC0gIkBFIiAtaXbgNWlzp49DSVZBkDIwMTcuMZFncmlkOjU',

    '2017 CIVA-Glider Unl Free Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHZ2xpZGVyiEZyZWUgS25vd26JQ0lWQYoxNYxTZWUgIkNyZWF0aW5nIGEgRnJlZSBLbm93biBzZXF1ZW5jZSIgaW4gdGhlIG1hbnVhbI0iQEEiICw0Yi4zZiAiQEIiIG9mICJAQyIgYzQsM2lmICJARCIg4CunNHRh4CvgICJARSIgLWgtj0NJVkGQMjAxNy4xkWdyaWQ6NQ',

    '2017 CIVA-Glider Adv Free Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdnbGlkZXKIRnJlZSBLbm93bolDSVZBijE1jFNlZSAiQ3JlYXRpbmcgYSBGcmVlIEtub3duIHNlcXVlbmNlIiBpbiB0aGUgbWFudWFsjSJAQSIgMmEyLSAiQEIiIC1yY7IgIkBDIiBoNCAiQEQiIDJ0NCAiQEUiIG8xj0NJVkGQMjAxNy4xkWdyaWQ6NQ',

    '2017 BAeA Club Known':
        'https://openaero.net/?s=gkFsbIRDbHVihjIwMTeHcG93ZXJlZIhLbm93bolCQWVBijEwizCNYzIgaK4gbyBtMiAoMiwxNykgM2ogMY9CQWVBkDIwMjIuMS43',

    '2017 BAeA Sports Known':
        'https://openaero.net/?s=gkFsbIRTcG9ydHOGMjAxN4dwb3dlcmVkiEtub3duiUJBZUGKMTWLMI0tMyUgMmcnIDUlIDJhtCDgYGiuLierfiAssm0yIOArZCvgICgwLDApICtpduA1c64nIGLgYDSuJ6v-IOBgZGgo4CmuLqsgMWMy4ODgj0JBZUGQMjAyMi4xLjeRQg',

    '2017 France Espoirs connu':
        'https://openaero.net/?s=gkFsbIRFc3BvaXJzh3Bvd2VyZWSIY29ubnWJRnJhbmNlijEwizCNdi0g4C1pZDIr4CAzPiBtMiDgYCtpdq4nc64gYG0xLf4gMTAlIDY-IOAtMmotIC0ssiwyIOBgYy6nLDKuLqcgaC6nIG-PRkZBdm9sdGlnZZAyMDE4LjEuNw',

    '2017 France Desavois/promotion connu':
        'https://openaero.net/?s=gkFsbIREZXNhdm9pcy9wcm9tb3Rpb26HcG93ZXJlZIhjb25udYlGcmFuY2WKMTWLMI1-Yi4tIDc-IC1tIGAraXZzrq4gbTmtIDEyJSA0PiDg4C0yajIt4OBgIC2nLDQ4fiAyPiBopyw0Licg4CssNHBiIODgYCtkYjIgKDEsMTgpIOBgKzJnIDEzJSAzPiDgKzJqK2AgZo9GRkF2b2x0aWdlkDIwMTguMS43',

    '2017 France National_2 connu 1':
        'https://openaero.net/?s=gkFsbIROYXRpb25hbF8yh3Bvd2VyZWSIY29ubnUgMYlGcmFuY2WKMjCLMI3gcGKuLi0gNT4gLW0yLSDgLWl2p2lzrq4gYG0nLGYssi3gIDY-IOAtM2ppbzOtra0t_iA1PiAtaDQup6t-PiCrLDI0cGKupyAtNCUg_itkYq6urq4nLSA-IH4tLDRiYCw0ri6nq34gMjRnMSAyZiwxLY9GRkF2b2x0aWdlkDIwMTguMS43',

    '2017 France National_2 connu 2':
        'https://openaero.net/?s=gkFsbIROYXRpb25hbF8yh3Bvd2VyZWSIY29ubnUgMolGcmFuY2WKMjCLMI1laiD-LTRoKyA1PiCnbTYrYCBpdq4nNnMuJyAsOHBirjSrKyAyNGBnMi0gKDAsMTIpIDclIOBgLTJqaW8yLeAgLTJpZiyyIGiuLqt-IDY-IP4yYq6uKyBvZiBtNCwzNI9GRkF2b2x0aWdlkDIwMTguMS43',

    '2017 France Doret/excellence connu 1':
        'https://openaero.net/?s=gkFsbIREb3JldC9leGNlbGxlbmNlh3Bvd2VyZWSIY29ubnUgMYlGcmFuY2WKMzWLMI1lZCA5bTZpZiwyLSD-ra3gcG4orq6urq4pLGatfiA0PiBgLS42aWanaXQuJyw4p60tIDU-IGAtYDVpc64naeIo4ODgLDMpLqcsMycrXj4gMz4gLLJ0YTI0Lqcr4CBgMmcyZi3gICgwLDE3KSDgYC0zajOtrS1-IC2nNKdoricgNz4gLDI0cnAzLDWPRkZBdm9sdGlnZZAyMDE4LjEuNw',

    '2017 France Doret/excellence connu 2':
        'https://openaero.net/?s=gkFsbIREb3JldC9leGNlbGxlbmNlh3Bvd2VyZWSIY29ubnUgMolGcmFuY2WKMzWLMI3gK2RoKCwzKaczaWYuKyA3PiDgYCunMWl0YScsMjQupyvgICdpZmiuJyA2bWYsMSAoOSw4KSBuKK6uLicsMjSurqcpNDgrIDU-IOArJzVzp2liQihgKSczK-BePiDgKywzZmKuLqc0ri4nIDU-IODgLDRgLDMuJ2dmIODgKzNqaW8xNS0-j0ZGQXZvbHRpZ2WQMjAxOC4xLjc',

    '2017 IAC Primary Known':
        'https://openaero.net/?s=gkFsbIRQcmltYXJ5h3Bvd2VyZWSIS25vd26JSUFDijONZCBpduA2c64uIGMuMiAoLTIsMTApIG8gMmogMY9JQUOQMjAxNy4x',

    '2017 IAC Sportsman Known':
        'https://openaero.net/?s=gkFsbIRTcG9ydHNtYW6HcG93ZXJlZIhLbm93bolJQUOKNo3jKC4sMuDgKS4nMuDgYCA1JSBtMit-IDJqXiBkIGl24DVzrq6uriBi4GA0LqsrIKurazI0LiAoLTIsOCkgbyBoKyCyj0lBQ5AyMDE3LjE',

    '2017 IAC Intermediate Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWHcG93ZXJlZIhLbm93bolJQUOKOI1vLLIgdiBpduA1c64gNGggMz4gK6cyZuBgd2Ar_iAoMCwxMykgKzI0YTItIDM-IC1gcmO0fiAoMCwxNCkg4HBiJzKuLiD-qzI0Zy4rYCAxajGPSUFDkDIwMTcuMQ',

    '2017 IAC Advanced Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdwb3dlcmVkiEtub3duiUlBQ4oxMo0s4DI0cnkyqyAyaDQ4rq4gMz4gLDguYkIo4ODgLDRgKS4yLqt-IHOuri5pcnAyZiwyLSA2JSCtMmppbzItIC3gaOAzZq4uJyAnNGBycDYt_j4gMj4gra0tazJmLDI0rq6uICttMzIsNmYtj0lBQ5AyMDE3LjE',

    '2017 IAC Unlimited Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHcG93ZXJlZIhLbm93bolJQUOKMjCNLyw0LDNmZGgzaWY7My6rK_4gMz4g_qsrMjQucGJCKODgYGYnKa4zri0gLTElIC01aXMsMq6up2lycDMsMzQtIDYlIC0yajE1IC_-qyw4dGHgYDJpZicr4CA0LDNoNWYgL6srMW4oLDVpZiwzrq4p4Cw1IDMlIOBgK6czaWYuaUJiKODg4OAsNCwyYCksNSBmYmAyNC4nj0lBQ5AyMDE3LjE',

    '2017 IAC-Glider Sportsman Known':
        'https://openaero.net/?s=gVVTQYJBbGyEU3BvcnRzbWFuhjIwMTeHZ2xpZGVyiEtub3duiUlBQ4oxNY3gYDIuJ3JjIHBiK-AgfjJqICgwLDkpICtiIC00JSD-Ky4yrqdyZGKuri6rK34gfisnMqd0rq4nIC4xKyAvb2or_iBoj0lBQ5AyMDE3LjEuMS4xkUI',

    '2017 IAC-Glider Intermediate Known':
        'https://openaero.net/?s=gVVTQYJBbGyESW50ZXJtZWRpYXRlhjIwMTeHZ2xpZGVyiEtub3duiUlBQ4oxNY2nsisgZKcgfml24GA2cy4nq6t-IFswLDEzXSDgYDIuZ-AyLi0gKDQsMCkg_q0yai0gKDAsOSkgLacyfiAvfisxajGrIOBgK2l0YeDgNC4r4OBgIC0zJSArpzKuJ3JkYq6uj0lBQ5AyMDE3LjEuMS4xkUI',

    '2017 IAC-Glider Advanced Known':
        'https://openaero.net/?s=gVVTQYJBbGyEQWR2YW5jZWSGMjAxN4dnbGlkZXKIS25vd26JSUFDijI1jWBzp2lycK2trS1-IDYlIOAtLicsMjTgYGl3LDKnK-AgKC0yLDApIG8xIH6raDSnIHRh4OBgNKcr4GAgLTIlIPAgKC0yLDApIG2tfiAoLTMsMTMpIC0uJzYrIP4rMmoyj0lBQ5AyMDE3LjEuMS4xkUI',

    '2017 IAC-Glider Unlimited Known':
        'https://openaero.net/?s=gVVTQYJBbGyEVW5saW1pdGVkhjIwMTeHZ2xpZGVyiEtub3duiUlBQ4oyNY0tMSUgLicyLDFpYy4nMjStLf4gLWl24Glzrq6nIG8yLSAtdGHg4DQuK-DgIGhgM2lmJy3-IP6trWsuMjQnrSAtMmoxNY9JQUOQMjAxNy4xLjEuMZFC',

    '2017 BAeA-Glider Intermediate Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWHZ2xpZGVyiEtub3duiUJBZUGKMTWLMTCNfqtpZzJ-IP4raC4nICgyLDApILIgNyUgMmogKC03LDApIC0yJSBwri4gbS0gKDQsMCkgLWlvLSAoMCwwKSAtaXauLicgKC0zLDApICwxICgtMiwwKSAtMSUgYzKuricgKDQsMCkgLTElICcyJ3Jjj0JBZUGQMjAxNy4xLjE',

    '2017 BAeA-Glider Int Free Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWHZ2xpZGVyiEZyZWUgS25vd26JQkFlQYoxNYxTZWUgIkNyZWF0aW5nIGEgRnJlZSBLbm93biBzZXF1ZW5jZSIgaW4gdGhlIG1hbnVhbI0iQEEiIDJ0ICJAQiIgYzIgIkBDIiBoICJARCIgbTIgIkBFIiAyYY9CQWVBkDIwMTcuMS4xkWdyaWQ6NQ',

    '2016 CIVA Unl Free Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHcG93ZXJlZIhGcmVlIEtub3duiUNJVkGKNDCMU2VlICJDcmVhdGluZyBhIEZyZWUgS25vd24gc2VxdWVuY2UiIGluIHRoZSBtYW51YWyNIkBBIiAv4ODg4OBgKzI0cvAoZikyNCAiQEIiICwzJ3BiQigsMmlmKSwzNC1gPiAiQEMiIK0sMm0sMzIsMmlmLSAiQEQiIC0zam8xNSAiQEUiIOArLDRpdGHgMmYnK2CPQ0lWQZAyMDE2LjEuMZFncmlkOjU',

    '2016 CIVA Adv Free Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdwb3dlcmVkiEZyZWUgS25vd26JQ0lWQYozMIxTZWUgIkNyZWF0aW5nIGEgRnJlZSBLbm93biBzZXF1ZW5jZSIgaW4gdGhlIG1hbnVhbI0iQEEiIG0sNjs2Zi0gIkBCIiDg4DZzLmlrsiAiQEMiIDJkYuBmpyAiQEQiIDRoMmYgIkBFIiAtMmpvMTWPQ0lWQZAyMDE2LjEuMZFncmlkOjU',

    '2016 CIVA Yak 52 Free Known':
        'https://openaero.net/?s=gkFsbIRZYWs1Modwb3dlcmVkiEZyZWUgS25vd26JQ0lWQYozMIxTZWUgIkNyZWF0aW5nIGEgRnJlZSBLbm93biBzZXF1ZW5jZSIgaW4gdGhlIG1hbnVhbI0iQEEiIGl24GA1cy4gIkBCIiAnaywyNCAiQEMiIG0yLLIgIkBEIiDgYDJmLmcnICJARSIgMWoxj0NJVkGQMjAxNi4xLjGRZ3JpZDo1',

    '2016 CIVA Int Free Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWHcG93ZXJlZIhGcmVlIEtub3duiUNJVkGKMzCMU2VlICJDcmVhdGluZyBhIEZyZWUgS25vd24gc2VxdWVuY2UiIGluIHRoZSBtYW51YWyNIkBBIiBpduBgNXMuICJAQiIgJ2ssMjQgIkBDIiBtMiyyICJARCIg4GAyZi5nJyAiQEUiIDFqMY9DSVZBkDIwMTYuMS4xkWdyaWQ6NQ',

    '2016 CIVA-Glider Unl Free Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHZ2xpZGVyiEZyZWUgS25vd26JQ0lWQYoxNYsxMIxTZWUgIkNyZWF0aW5nIGEgRnJlZSBLbm93biBzZXF1ZW5jZSIgaW4gdGhlIG1hbnVhbI0iQEEiIOBgLXRh4DJpZi4rYCAiQEIiIC1tMSAiQEMiIGlkMmYtICJARCIgNGggIkBFIiAtJ2uPQ0lWQZAyMDE2LjEuMZFncmlkOjU',

    '2016 CIVA-Glider Adv Free Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdnbGlkZXKIRnJlZSBLbm93bolDSVZBijE1izEwjFNlZSAiQ3JlYXRpbmcgYSBGcmVlIEtub3duIHNlcXVlbmNlIiBpbiB0aGUgbWFudWFsjSJAQSIgLWQyICJAQiIgaCAiQEMiIDKncmRiICJARCIgcSgxKSAiQEUiIG0yj0NJVkGQMjAxNi4xLjGRZ3JpZDo1',

    '2016 France Espoirs Connu':
        'https://openaero.net/?s=gkFsbIRlc3BvaXJzh3Bvd2VyZWSIY29ubnWJRnJhbmNlijEwjWVkIDJnIGl2Lqc1c66uIG2yrX4gNT4gfi0zaq2tLSAtLDIgaK6upyBycCv-IGOurjKuLivgYCDg4G02j0ZGQXZvbHRpZ2WQMjAxNy4yLjE',

    '2016 France Desavois/promotion Connu':
        'https://openaero.net/?s=gkFsbIRkZXNhdm9pc4dwb3dlcmVkiGNvbm51iUZyYW5jZYoxNY0yaK4t_iAt4GBtMi3-IDU-IC1pdi4naXOufiA5PiDga6cyNCAsNKdwYi6nK2AgKDAsMCkg_uA4J2KupytgIDQ-IG1mLSB-LeAssuAtfiAxMiUgMz4g4OAtMmoyLeBgIH4tMjR-j0ZGQXZvbHRpZ2WQMjAxNy4yLjE',

    '2016 France National2 Connu1':
        'https://openaero.net/?s=gkFsbIRuYXRpb25hbDKHcG93ZXJlZIhjb25udV8xiUZyYW5jZYoyMI1laiB-KzhiLSAtLDRoNK6nIDU-IC4nbTM0LDUgri6nc2lycDI0IGg0ICJ8IjhwYq6nLX4gLW8yNCBtMSyyLSAoLTgsMTQpIDYlIOAtMmppbzE1ID4gLDJmZ49GRkF2b2x0aWdlkDIwMTcuMi4x',

    '2016 France National2 Connu2':
        'https://openaero.net/?s=gkFsbIRuYXRpb25hbDKHcG93ZXJlZIhjb25udV8yiUZyYW5jZYoyMI1lZCDgLTFnIOBgKy6nc6dpcnAtIOBgLS5pcmMyLeAgKDAsNSkgLTJpZiyyIGg4LicgMj4gJzJwYuBgNC6nIDEzJSDgYCvg4ODgLDQ44GByYyvg4ODg4OAgb7QgZGiuri6rq_4gND4gp22nOCwzNH4g4Cszam9pM_4-j0ZGQXZvbHRpZ2WQMjAxNy4yLjE',

    '2016 France Doret/excellence Connu1':
        'https://openaero.net/?s=gkFsbIRkb3JldIdwb3dlcmVkiGNvbm51XzGJRnJhbmNlijQwjS1pdGHgLDI0K-DgIDM0aCczaWan_iAxMD4gZuIoYCw0pykzLT4gLTIlIC1pcydpcnA2aWYr4CAtMiUgqzNqbzE1ra2tfiA5PiB-rS1wYi6nLDgr4OA-IGAr4ygxKWYr4OBgIOArLDQnLDKnYq4upzQuIOArMSwyZnJjMywzNI9GRkF2b2x0aWdlkDIwMTcuMi4x',

    '2016 France Doret/excellence Connu2':
        'https://openaero.net/?s=gkFsbIRkb3JldIdwb3dlcmVkiGNvbm51XzKJRnJhbmNlijQwjWVkICxmcmRiMjQuJyvg4OAgLDNiLiczZqcgpywyNHRhLqcgOD4gJyxpZmBuKC6nLDKuri4pMmArIFswLDBdIDZzaXJwLGlmLDEtfiDg4C0zam9pMy3-IDEzPiCtLWA4YGiuJ6srfiAzPiAuNCwzbTIsNiBgK-Dg4CwyZuByYycsuCvg4ODg4I9GRkF2b2x0aWdlkDIwMTcuMi4x',

    '2016 BAeA-Glider Int Free Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWGMjAxNodnbGlkZXKIRnJlZSBLbm93bolCQWVBijE1izEwjEJhc2UgRmlndXJlcyBmb3IgSW50ZXJtZWRpYXRlIEZyZWUgS25vd24gMjAxNo0iQEEiIDJ0ICJAQiIgYzIgIkBDIiBoICJARCIgbTIgIkBFIiAyYY9CQWVBkDIwMTYuMS4zkWdyaWQ6NQ',

    '2015 CIVA Unl Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHcG93ZXJlZIhLbm93bolDSVZBijQwjSwzLDNpZqdkaK4zaWYsMy6rqyAnLDI0LDJpdGEuNq4uqyBgNCwzaWZgcnmuLicssi6rqysgK2biKDMuJyk1rT4gLWlzLDEuaXJwLDJmLGA2LSB-ra0zam9pMTWrq6urq6sgKyw0Yq5mrqurPiAxJSB-q6szLDdtOWlmLSCtMWMzZjs1j0NJVkGQMS41LjA',

    '2015 CIVA Adv Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdwb3dlcmVkiEtub3duiUNJVkGKMzCNMmRoKDQpM2YuqysgLDI0p2IxrqsrIH4rZi5yZGIuNq6uK-Dg4GAgqytuKCwyNCcpLDKtra0gNj4gLWl2LDVpc66uJyCrLjQncnAsOa2tLSCtrSw4aK4zri6rqyAxJSCrqzFtNiw2Zi0gLTNqMy2PQ0lWQZAxLjUuMA',

    '2015 CIVA Yak 52 Known':
        'https://openaero.net/?s=gkFsbIRZYWs1Modwb3dlcmVkiEtub3duiUNJVkGKMzCNL29mIKsray4sMjSurisgbSwyLLKrqyA2PiArMmZhK34gKC2xLDEyKSCrYCw0Yi4nK-AgaGAsOKf-ICdycDEgMSUgMj4g4Cvg4DJmLmfg4OAssi4nK2AgKC0xLDE3KSAxajUtj0NJVkGQMS41LjA',

    '2015 CIVA Int Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWHcG93ZXJlZIhLbm93bolDSVZBijMwjS9vZiCrK2suLDI0rq4rIG0sMiyyq6sgNj4gKzJmYSt-ICgtsSwxMikgq2AsNGIuJyvgIGhgLDin_iAncnAxIDElIDI-IOAr4OAyZi5n4ODgLLIuJytgICgtMSwxNykgMWo1LY9DSVZBkDEuNS4w',

    '2015 CIVA-Glider Unl Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHZ2xpZGVyiEtub3duiUNJVkGKMTWLMTCNLzJmaWMuMq0grWE2rSAoMywxMCkgLWl0YeA0LiB-Kyw0cGIgbzJpZi0gMyUg4C0yam9pNTEr4CAoNSw0KSBjLicsMjSPQ0lWQZAxLjUuMA',

    '2015 CIVA-Glider Adv Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdnbGlkZXKIS25vd26JQ0lWQYoxNYsxMI3gcy5pcnCtLSCtMmqtICgwLDgpIC0xLSAtdK4uJysgbyy0IGl0YeAsNC4gaDQuK34gq2LgYCsgMyUgKzJqPiBkj0NJVkGQMS41LjA',

    '2015 BAeA Beginners Known':
        'https://openaero.net/?s=gkFsbIRCZWdpbm5lcnOHcG93ZXJlZIhLbm93bolCQWVBijEwjS9pZCBvIGArYy4sMi6rIH6rK2iuLiAzJSBvaiAxj0JBZUGQMjAxNi4xLjM',

    '2015 BAeA Standard Known':
        'https://openaero.net/?s=gkFsbIRTdGFuZGFyZIdwb3dlcmVkiEtub3duiUJBZUGKMTWNZWQgqywycmMgZCBpduBgNnOuLqurICtjLjJgICgtMyw3KSBvIGjgNCcg_itvaisgND4g_qsrbTIgaWSuLiAxj0JBZUGQMjAxNi4xLjM',

    '2015 France Espoirs Connu':
        'https://openaero.net/?s=gkFsbIRlc3BvaXJzh3Bvd2VyZWSIY29ubnWJRnJhbmNlijEwjWQgaXYnNnOuJ6srICtoriBvIH5tLSAoMCwxMykgLbItIDIlIC0yai0gLTIgNiUgMmp-IH4rYzKuLicr4CAzJSDgYCvg4OBgMuByY-Dg4Ct-IDY-IG0yj0ZGQXZvbHRpZ2WQMjAxNi4xLjQ',

    '2015 France Desavois Connu':
        'https://openaero.net/?s=gkFsbIRkZXNhdm9pc4dwb3dlcmVkiGNvbm51iUZyYW5jZYoxNY1lZCBpcmNmLSAtaXYuJ2lzLiA0PiAyNGgupy0g4C1jpywypy3gIDI-IC1wYq4gNj4gOGKuLivgYCA-IGArYCw0a2AyYCvgYCAyJSBgK20yLDEr4CAtNCUg4Csxam8xj0ZGQXZvbHRpZ2WQMjAxNi4xLjQ',

    '2015 France National2 Connu1':
        'https://openaero.net/?s=gkFsbIRuYXRpb25hbDKHcG93ZXJlZIhjb25udV8xiUZyYW5jZYoyMI1kMiwyNCDgK2l2cy4nLSAoLbEsNykgLWsyLSAt4DRiLicgMjRoNCAuJ21mLSAoLTUsMTMpIC1gOCw1LWAgMiUg4C0yamlvMTUr4CAtMiUgNT4g4Cu0Y6csMi4nK-AgKC0xLDcpICw0cGKnIDM-IC4sNKdycLJ-Po9GRkF2b2x0aWdlkDIwMTYuMS40',

    '2015 France National2 Connu2':
        'https://openaero.net/?s=gkFsbIRuYXRpb25hbDKHcG93ZXJlZIhjb25udV8yiUZyYW5jZYoyMI1laiAnMjQnaCc0Lj4gfnYnNCetIK1pdi41aXMuJ34gb7IgJzInZGiurqetLSAxNT4gLW0yLSDgLa6uJ2lyYyvgIDQsMy0gNiUg4OAtMmpvaTE1K-BgIDUlID4g4GAr4ODg4DJm4GByY2Ar4ODgIDI-IP4r4GBrLqcsMjQnK-AgYCtkMjQsMo9GRkF2b2x0aWdlkDIwMTYuMS40',

    '2015 France Doret Connu1':
        'https://openaero.net/?s=gkFsbIRkb3JldIdwb3dlcmVkiGNvbm51XzGJRnJhbmNlijQwjS1pdGHgLDI0K-DgIDM0aCczaWan_iAxMD4gZuIoYCw0pykzLT4gLTIlIC1pcydpcnA2aWYr4CAtMiUgqzNqbzE1ra2tfiA5PiB-rS1wYi6nLDgr4OA-IGAr4ygxKWYr4OBgIOArLDQnLDKnYq4upzQuIOArMSwyZnJjMywzNI9GRkF2b2x0aWdlkDIwMTYuMS40',

    '2015 France Doret Connu2':
        'https://openaero.net/?s=gkFsbIRkb3JldIdwb3dlcmVkiGNvbm51XzKJRnJhbmNlijQwjWVqIC4nLDN0YTGnIGlmYq4yNC4nK-BgIDQ-IP4xbiguNDiurqcpLDgrIDM-IOBgN3NgaWvgYDI04GAt4CDgYC0sMmE0LDMr4CAoLTMsMTMpIOBgK2FjKDIpNmYsNi3g4ODgYCAoLTYsMTYpIODgLTNqb2kzrS1-IDM-IH6tNGgyaWYuJyAsNDhnLGaPRkZBdm9sdGlnZZAyMDE2LjEuNA',

    '2014 CIVA Unl Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHcG93ZXJlZIhLbm93bolDSVZBijQwjTI7NmlmdC4yNC6rqyAuNCwzJ3RhLiwxLqurKyAzPiArMmlm4HJwKDQyKTQsM60tICgwLDEyKSA0JSB-rS0yam8xLSCtrS1wbihgNWYsNa6uri4pMisgND4g4Cvg4GA1cywyrmli4GAzNC0-IC2nMmlmOzHgaXcoLDI0KSw5ZqurIKsrLDNmaCczrqurKyCrKyw1LDdtLGY7Ni2PQ0lWQZAxLjQuMQ',

    '2014 CIVA Adv Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdwb3dlcmVkiEtub3duiUNJVkGKMzCNLyw0LDMucmRiMjSuLSA0PiAtMm2yLf4gKDAsMTYpIC0yNGnwOCA1c65pcnBmO7KtrSCtrTNqMy0gKC04LDEyKSAtaDNmLiDxIDI-IOBgcnAoLDEpMiAoLTEsMjApICwyZnJjuI9DSVZBkDEuNC4x',

    '2014 CIVA Yak 52 Known':
        'https://openaero.net/?s=gkFsbIRZYWs1Modwb3dlcmVkiEtub3duiUNJVkGKMzCNZWphIC8sNHJwLDQsM62tLSA0PiAtLnJjMiw2KyA0PiCrKy5uKCwyNCcpK2Ag4Cs1c66uqyCrK2IuJyw0LicrIG9mICtori6rIDIlIKurtG0sMjQgMWoxj0NJVkGQMS40LjE',

    '2014 CIVA Int Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWHcG93ZXJlZIhLbm93bolDSVZBijMwjWVqYSAvLDRycCw0LDOtrS0gND4gLS5yYzIsNisgND4gqysubigsMjQnKStgIOArNXOurqsgqytiLicsNC4nKyBvZiAraK4uqyAyJSCrq7RtLDI0IDFqMY9DSVZBkDEuNC4x',

    '2014 CIVA-Glider Unl Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHZ2xpZGVyiEtub3duiUNJVkGKMTWLMTCNpzI0aXJjICtpduBzrq6tfiAtMSUg4C1iMmlmK2Ag4Ct0YeA0pyvgYCA0aCAtMSUgYCtvZiAtMyUgYCtjri4nLSAtMmppbzE1j0NJVkGQMS40LjE',

    '2014 CIVA-Glider Adv Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdnbGlkZXKIS25vd26JQ0lWQYoxNYsxMI1pZDItIC0sMSwyIC0yJSAyPiBkYmAsMqcgKDAsMTUpIODgYCtpdGEr4OAg4GArcGLgLDQnIGhgNC6rqyAtMSUgq6twKCwyrimrIC0xJSCrY6cyNC6PQ0lWQZAxLjQuMQ',

    '2014 France Espoirs Connu':
        'https://openaero.net/?s=gkFsbIRlc3BvaXJzh3Bvd2VyZWSIY29ubnWJRnJhbmNlijEwjWsyIDY-IH5tMiBpdnOuLqcgYDJyYyAoLTksMTYpIG0tIC2nLDGnLSAtMiUgNj4gLTNqra3-ID4gLTInID4gfiszaiBori5-IG-PRkZBdm9sdGlnZZAxLjUuMA',

    '2014 France Desavois Connu':
        'https://openaero.net/?s=gkFsbIRkZXNhdm9pc4dwb3dlcmVkiGNvbm51iUZyYW5jZYoxNY1lZCB2LSBbMCwwXSAtaXZpc64uIFstMywxXSAycGKuLqcgMiUgNGg0LicgWy00LDBdIC0xJSBtZi0gWzQsMTNdIC0yam8yLSAxJSAtYDJjpy0gWzMsMF0gfi1jrq4upyBbLTQsMF0gbTI0IDIsMS2PRkZBdm9sdGlnZZAxLjUuMA',

    '2014 France National2 Connu1':
        'https://openaero.net/?s=gkFsbIRuYXRpb25hbDKHcG93ZXJlZIhjb25udV8xiUZyYW5jZYoyMI0-_q0tpzFyYyAxMD4gbbItIC1pdjVpc64gMj4g_iwycGKuLiw0IGArbWYt_iAxMD4gMTIlIODgLTJqaW8yLeBgIC0xLDIgYywyNK6upyvgYCDgK28yLWAgLTRoLjQupyDjKDIpMiBycC-PRkZBdm9sdGlnZZAxLjUuMA',

    '2014 France National2 Connu2':
        'https://openaero.net/?s=gkFsbIRuYXRpb25hbDKHcG93ZXJlZIhjb25udV8yiUZyYW5jZYoyMI1lZCAyJSCyZzEtIDUlIGAtaXYuaXMuJ34gMiUgNT4gbWYsMS0gKDAsMTkpIOAtMmMyLqcgMjRwYjQupyvgIP44J2iuLict_j4gMj4gLW8yIDUlIDI-IG0tYCAtYDJpZiwxK-AgLTIlIOArM2ppbzOPRkZBdm9sdGlnZZAxLjUuMA',

    '2014 France Doret Connu1':
        'https://openaero.net/?s=gkFsbIRkb3JldIdwb3dlcmVkiGNvbm51XzGJRnJhbmNlijQwjWVqIC8tLqcyNGl0YTg-ICdm4igupzIpIC0xJSCnOXMup2lycDZmLiw24GAtIDQ-IC0yJSAtM2pvaTMtfj4gLThorq4yri4nPiA4PiCupzMsOKdtNDgsMjSnIC0yJSAyZmcyLSAoLTIwLLIpIC1pYWMoMixpZikgLTElIDIsMjRtMSxpZi3gj0ZGQXZvbHRpZ2WQMS41LjA',

    '2014 France Doret Connu2':
        'https://openaero.net/?s=gkFsbIRkb3JldIdwb3dlcmVkiGNvbm51XzKJRnJhbmNlijQwjWVqIC8uLDN0YS3gYD4gNj4gLTJraWYsMi4gNj4gfmlmbiiuLqcyrq4pNC0gNT4greAsN2lzLidp4ijg4GAsMimurqc-IDE3PiBtMmYsMSvgIC0yJSDgKzNqMTUtIC1oLDQuPiAoLTMwLDEzKSDg4CsycuMoYDFgLDJmYCkg4GAsMjQuJ2fgZo9GRkF2b2x0aWdlkDEuNS4w',

    '2013 CIVA Adv Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdwb3dlcmVkiEtub3duiUNJVkGKMzCNLDI0cOIoMyknNK0tIK0taXNpbigxKSw0fiArOGIuMmYgMz4g_jJtLDgsMy1-ICgtNCwxMikgLTJqb2kxNf4gfmhmLv4gfuDg4DJm4HJjLDI04ODg4OAtICgwLDEwKSAtbyw2IKttMzIsNmYtj0NJVkGQMS40LjE',

    '2013 CIVA Unl Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHcG93ZXJlZIhLbm93bolDSVZBijQwjSssMiwyZid6dCwyZjsyK34gMj4g_jcsM20sNWlmLDMgWzAsMTldIDI0aXAxIDM-IDIlIH7gYCxzLDNpZq4uaWJwYijgYDMpriwzZiw0Jz4gaWZoNWauIDM-IC44J3JwKLQpOT4gWzAsOF0gfqszam9pMTWtrS1-IFstMywyXSAtLiw0dGFmLj4gMzRwYjNeLo9DSVZBkDEuNC4x',

    '2013 CIVA-Glider Unl Known':
        'https://openaero.net/?s=gkFsbIRVbmxpbWl0ZWSHZ2xpZGVyiEtub3duiUNJVkGKMTWLMTCNLzJpZyBpdGHgYDNmJy0gLWg0IG8sMmlmLSA1JSAt4ODg4DI04HJj4OAtIC00OCAyam9pMo9DSVZBkDEuNC4x',

    '2013 CIVA-Glider Adv Known':
        'https://openaero.net/?s=gkFsbIRBZHZhbmNlZIdnbGlkZXKIS25vd26JQ0lWQYoxNYsxMI1pdnMgdGE0K-DgLyBiLiw0IGgnLiBvMSBjri0gLTJqLSAtLDI0IDJ0LiAyao9DSVZBkDEuNC4x',

    '2013 BAeA Int Known':
        'https://openaero.net/?s=gkFsbIRJbnRlcm1lZGlhdGWHcG93ZXJlZIhLbm93bolCQWVBijIwjWVqIC9gLDRgcnAy_iA1JSD-MmoyIDElICsyNGljLDI04OBgLSBbMCwxNF0grTFpYy4gMj4gqysyaiAoMCwxMCkgZDItIC1pdmBpcy6rqyCrKzRoLjQuqyCyIG0yICwyZi2PQkFlQZAxLjQuMQ',

    '2013 France Espoirs Connu':
        'https://openaero.net/?s=gkFsbIRlc3BvaXJzh3Bvd2VyZWSIY29ubnWJRnJhbmNlijEwjWVkIDJnIGl2NXOup14gLTIlIG0sMit-IDQ-ICszan4gLTMlIGOnMqcr4GAgKC0yLDEyKSBvIOAraC6nKyA2PiBtLf4gfi0yai0gKDMsNykgLTEtj0ZGQXZvbHRpZ2WQMS40LjE',

    '2013 France Desavois Connu':
        'https://openaero.net/?s=gkFsbIRkZXNhdm9pc4dwb3dlcmVkiGNvbm51iUZyYW5jZYoxNY1kMjQtIC1pdidpc6cgMmguLSAtMyUgLW0r_iA2JSAzPiAyajIgKDIsNikgLTMlIOArMiwyYzKuLqcr4CDg4CssNHBiK-DgIDI-ICs0ay4nMicgK20yIDJmLY9GRkF2b2x0aWdlkDEuNC4x',

    '2013 France National2 Connu1':
        'https://openaero.net/?s=gkFsbIRuYXRpb25hbDKHcG93ZXJlZIhjb25udV8xiUZyYW5jZYoyMI0tZDEtIC1pdjVpcy8gLDRoIG8xIDI-IH4rJ2unMmlmri6nK-BgIOBgKzJmZ-AyLSAoLTgsMykgMTIlIOBgLTJqb2kyLeBgIC00LDMgL-BoNCcg_jhiqysgq20yLLSPRkZBdm9sdGlnZZAxLjQuMQ',

    '2013 France National2 Connu2':
        'https://openaero.net/?s=gkFsbIRuYXRpb25hbDKHcG93ZXJlZIhjb25udV8yiUZyYW5jZYoyMI12JzQnLyA3c6dpcnAy_iDgYDQsNWOurict4CDgLTJkaK4uK2Ag4yvgYCAyPiBtZjsyK-AgKDIsMTMpIDMlIDJqb2kyIC9-K-BgazI0ricr4CDgK2-0K-AgNSUg4GAr4ODg4DQ44GByYyA-IKsrcnAyLDI0j0ZGQXZvbHRpZ2WQMS40LjE',

    '2013 France Doret Connu1':
        'https://openaero.net/?s=gkFsbIRkb3JldIdwb3dlcmVkiGNvbm51XzGJRnJhbmNlijQwjf4tLGZwYmAsMqcgpywyNGl0YS4nK-DgYCA4PiAvbigupzZpZq6nKSwifCI0JyDgN3OuaWvgMmbgYC0gMTQlIH4tNDhhMzQsMy3gYCDg4GAtMmFjKDIpNmYsNi3g4OAgKC01LDEzKSAtMyUgfi0zam8zrS1-LyD-Lac4J2gnqys-IKvgMjQuJ2fgMixpZictj0ZGQXZvbHRpZ2WQMS40LjE',

    '2013 France Doret Connu2':
        'https://openaero.net/?s=gkFsbIRkb3JldIdwb3dlcmVkiGNvbm51XzKJRnJhbmNlijQwjWVqIDNoYDJmpyAnOGB0YSw0Li0gLTIlIC0nLGlmLnJkYi4nsq6nK-DgYCA1PiAraWZuKC4sMq6uKeDgLSAtMiUgMz4gLSc2aXOuaXJwp2anLDktIC0zamlvMy3-LyAoMTAsMTQpIC0zJSB-rS2nNHJwMyw1rS0-IDQ-IK2trS3ga64nZi4nK-BgIC0xJSBgKzEsMjRtuI9GRkF2b2x0aWdlkDEuNC4x'

}
