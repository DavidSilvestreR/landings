<?php
header('Content-Type: application/json');
if (!empty($_POST)){
// Save form in Drive
   $IDS = time().'-'.mt_rand();
   $ID      = 'QL-' . $IDS; 
$Url = "https://docs.google.com/forms/d/e/1FAIpQLSeRBsrT1crinnp9IY_kt_QmM-kBLvgsSIp9DGiSK_-WFZzCiA/formResponse";
      $id =$ID;
      $fullname = "entry.1547516177=" . replaceCharacter($_POST['fullname']);
      $correo = "entry.1494230708=" . replaceCharacter($_POST['mail']);
      $telefono = "entry.682733425=" . $_POST['phone'];
      $grado="entry.1295233448=".replaceCharacter($_POST['grado']); 
      $strRequest = "$id&$fullname&$correo&$telefono&$grado";
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $Url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $strRequest);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
      curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
      $result = curl_exec($ch);
      curl_close($ch);
      echo json_encode(true);


}else{
   echo json_encode("No_result");
}
function replaceCharacter($string)
{
        $originales = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ
ßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŔŕ';
        $modificadas = 'AAaaaaacEEeeIIiidNOOooooUUuuy
bsaaaaaaaceeeeiiiidnoooooouuuyybyRr';
        $string = utf8_decode($string);
        $string = strtr($string, utf8_decode($originales), $modificadas);
        return utf8_encode($string);
    }

 ?>